const { createEmbed } = require('../../utils/embed');

const queues = new Map();
function getQueue(guildId) {
  if (!queues.has(guildId)) queues.set(guildId, { player: null, connection: null, songs: [] });
  return queues.get(guildId);
}

module.exports = {
  name: 'stop',
  description: 'Stop playback and clear the queue.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    if (queue.player) queue.player.stop();
    if (queue.connection) queue.connection.destroy();
    queue.songs = [];
    queue.player = null;
    queue.connection = null;
    return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Playback stopped and queue cleared.' })] });
  }
};
