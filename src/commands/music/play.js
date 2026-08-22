const { createEmbed } = require('../../utils/embed');
const { addSong, getQueue, resetPlayback } = require('./musicState');

function getVoiceModule() {
  try {
    return require('@discordjs/voice');
  } catch (error) {
    return null;
  }
}

async function resolveTrack(query) {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  try {
    const playDl = require('play-dl');
    const isUrl = /^https?:\/\//i.test(trimmed);
    const source = isUrl ? trimmed : (await playDl.search(trimmed, { limit: 1 }))?.[0]?.url || trimmed;
    const info = isUrl ? await playDl.video_basic_info(source) : await playDl.video_basic_info(source);
    const title = info?.video_details?.title || trimmed;
    return { title, url: source };
  } catch (error) {
    return { title: trimmed, url: trimmed };
  }
}

async function playNext(guildId, message) {
  const queue = getQueue(guildId);
  if (!queue.songs.length) {
    resetPlayback(guildId);
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: 'Queue finished.' })] });
  }

  const voice = getVoiceModule();
  if (!voice) {
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: 'Audio playback is currently unavailable because @discordjs/voice is not installed in this environment.', color: 'Red' })] });
  }

  const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = voice;
  const song = queue.songs.shift();
  const resolved = await resolveTrack(song.url || song.title);
  if (!resolved) {
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: 'Unable to resolve that track.', color: 'Red' })] });
  }

  song.title = resolved.title;
  song.url = resolved.url;
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

  let stream;
  try {
    const playDl = require('play-dl');
    stream = await playDl.stream(song.url, { quality: 0 });
  } catch (error) {
    console.error('Music stream failed:', error);
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: 'That track could not be streamed.', color: 'Red' })] });
  }

  const resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
  if (resource.volume) resource.volume.setVolume(Math.max(0, Math.min(1, (queue.volume || 100) / 100)));
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

    const queue = addSong(message.guild.id, { title: query, url: query });

    if (!queue.playing) {
      await playNext(message.guild.id, message);
    } else {
      return message.reply({ embeds: [createEmbed({ title: 'Queued', description: `Added to queue: ${query}` })] });
    }
  }
};
