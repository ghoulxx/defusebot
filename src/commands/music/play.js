const { createEmbed } = require('../../utils/embed');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const queues = new Map();

function getQueue(guildId) {
  if (!queues.has(guildId)) queues.set(guildId, { songs: [], playing: false, connection: null, player: null, current: null });
  return queues.get(guildId);
}

async function playNext(guildId, message) {
  const queue = getQueue(guildId);
  if (!queue.songs.length) {
    queue.playing = false;
    queue.current = null;
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: 'Queue finished.' })] });
  }

  const song = queue.songs.shift();
  queue.current = song;
  queue.playing = true;

  if (!queue.connection) {
    queue.connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
  }

  if (!queue.player) {
    queue.player = createAudioPlayer();
    queue.connection.subscribe(queue.player);
    queue.player.on('stateChange', (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
        playNext(guildId, message).catch(() => {});
      }
    });
  }

  const resource = createAudioResource(song.url, { inputType: 'arbitrary' });
  queue.player.play(resource);
  return message.channel.send({ embeds: [createEmbed({ title: 'Now playing', description: `${song.title}` })] });
}

module.exports = {
  name: 'play',
  description: 'Play a song or add it to the queue.',
  async execute(message, args) {
    if (!message.member.voice?.channel) {
      return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Join a voice channel first.', color: 'Red' })] });
    }

    const query = args.join(' ');
    if (!query) {
      return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Usage: $play <youtube-url-or-search-term>', color: 'Red' })] });
    }

    const queue = getQueue(message.guild.id);
    queue.songs.push({ title: query, url: query });

    if (!queue.playing) {
      await playNext(message.guild.id, message);
    } else {
      return message.reply({ embeds: [createEmbed({ title: 'Queued', description: `Added to queue: ${query}` })] });
    }
  }
};
