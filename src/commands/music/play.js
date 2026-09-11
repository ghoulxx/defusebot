const { createEmbed } = require('../../utils/embed');
const { addSong, getQueue, resetPlayback } = require('./musicState');

try {
  const ffmpegPath = require('ffmpeg-static');
  if (ffmpegPath && !process.env.FFMPEG_PATH) {
    process.env.FFMPEG_PATH = ffmpegPath;
  }
} catch (error) {
  // ffmpeg-static will be installed by package.json for Railway builds.
}

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
    let source = trimmed;
    let title = trimmed;

    console.log(`[Music] Resolving: ${trimmed.substring(0, 50)}...`);

    if (isUrl) {
      const lower = trimmed.toLowerCase();
      if (/spotify\.com/i.test(lower)) {
        console.log('[Music] Detected Spotify URL, attempting resolution...');
        const spotifyItem = await playDl.spotify(trimmed).catch((e) => {
          console.error('[Music] Spotify resolution failed:', e.message);
          return null;
        });
        const searchText = spotifyItem
          ? `${spotifyItem.name || spotifyItem.title || trimmed}${spotifyItem.artists?.length ? ` ${spotifyItem.artists.map((artist) => artist.name || artist).join(' ')}` : ''}`.trim()
          : trimmed;
        const searchResults = await playDl.search(searchText, { limit: 1 }).catch((e) => {
          console.error('[Music] Search failed:', e.message);
          return [];
        });
        source = searchResults?.[0]?.url || trimmed;
      }
    } else {
      console.log('[Music] Search query:', trimmed);
      const searchResults = await playDl.search(trimmed, { limit: 1 }).catch((e) => {
        console.error('[Music] Search failed:', e.message);
        return [];
      });
      source = searchResults?.[0]?.url || trimmed;
      console.log('[Music] Search result URL:', source.substring(0, 50));
    }

    const info = await playDl.video_basic_info(source).catch((e) => {
      console.error('[Music] Video info fetch failed:', e.message);
      return null;
    });
    title = info?.video_details?.title || info?.title || title;
    console.log('[Music] Resolved title:', title);
    return { title, url: source };
  } catch (error) {
    console.error('[Music] Track resolve failed:', error.message || error);
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
    try {
      console.log(`[Music] Joining voice channel: ${message.member.voice.channel.id}`);
      queue.connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      console.log('[Music] Voice connection created');
    } catch (error) {
      console.error('[Music] Failed to join voice channel:', error.message || error);
      return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: `Failed to join voice channel: ${error.message}`, color: 'Red' })] });
    }
  }

  if (!queue.player) {
    try {
      queue.player = createAudioPlayer();
      queue.connection.subscribe(queue.player);
      console.log('[Music] Audio player created and subscribed');
      
      queue.player.on('error', (error) => {
        console.error('[Music] Player error event:', error.message || error);
      });
      
      queue.player.on('stateChange', (oldState, newState) => {
        console.log(`[Music] Player state: ${oldState.status} -> ${newState.status}`);
        if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
          console.log('[Music] Track finished, playing next...');
          playNext(guildId, message).catch(() => {});
        }
      });
    } catch (error) {
      console.error('[Music] Failed to create audio player:', error.message || error);
      return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: `Failed to create audio player: ${error.message}`, color: 'Red' })] });
    }
  }

  let stream;
  try {
    const playDl = require('play-dl');
    console.log(`[Music] Attempting to stream: ${song.url}`);
    stream = await playDl.stream(song.url, { quality: 0 });
    
    if (!stream) {
      console.error('[Music] Stream returned null or undefined');
      return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: 'Failed to create stream. Track may be restricted.', color: 'Red' })] });
    }
  } catch (error) {
    console.error('[Music] Stream error:', error.message || error);
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: `Stream failed: ${error.message || 'Unknown error'}. Track may be unavailable or restricted.`, color: 'Red' })] });
  }

  try {
    const streamSource = stream.stream || stream;
    const inputType = stream.type || 'arbitrary';
    console.log(`[Music] Creating audio resource with type: ${inputType}`);
    const resource = createAudioResource(streamSource, { inputType, inlineVolume: true });
    console.log('[Music] Audio resource created successfully');
    
    if (resource.volume) {
      resource.volume.setVolume(Math.max(0, Math.min(1, (queue.volume || 100) / 100)));
      console.log(`[Music] Volume set to ${queue.volume || 100}%`);
    }
    
    console.log(`[Music] Player status before play: ${queue.player.state?.status || 'unknown'}`);
    queue.player.play(resource);
    console.log(`[Music] play() called. Player status after: ${queue.player.state?.status || 'unknown'}`);
    console.log(`[Music] Now playing: ${song.title}`);
    return message.channel.send({ embeds: [createEmbed({ title: 'Now playing', description: `${song.title}` })] });
  } catch (error) {
    console.error('[Music] Audio resource creation failed:', error.message || error);
    return message.channel.send({ embeds: [createEmbed({ title: 'Music', description: `Audio resource error: ${error.message || 'Unknown error'}.`, color: 'Red' })] });
  }
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
