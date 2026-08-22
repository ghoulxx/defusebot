const queues = new Map();

function getQueue(guildId) {
  if (!queues.has(guildId)) {
    queues.set(guildId, {
      songs: [],
      playing: false,
      connection: null,
      player: null,
      current: null,
      volume: 100
    });
  }
  return queues.get(guildId);
}

function addSong(guildId, song) {
  const queue = getQueue(guildId);
  queue.songs.push(song);
  return queue;
}

function clearQueue(guildId) {
  const queue = getQueue(guildId);
  queue.songs = [];
  queue.playing = false;
  queue.current = null;
  return queue;
}

function removeSong(guildId, index) {
  const queue = getQueue(guildId);
  if (index < 0 || index >= queue.songs.length) return null;
  return queue.songs.splice(index, 1)[0];
}

function setVolume(guildId, volume) {
  const queue = getQueue(guildId);
  queue.volume = Math.max(0, Math.min(100, volume));
  return queue;
}

function resetPlayback(guildId) {
  const queue = getQueue(guildId);
  queue.playing = false;
  queue.current = null;
  return queue;
}

module.exports = {
  getQueue,
  addSong,
  clearQueue,
  removeSong,
  setVolume,
  resetPlayback
};
