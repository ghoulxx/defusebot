const { createEmbed } = require('../../utils/embed');

const queues = new Map();
function getQueue(guildId) {
  if (!queues.has(guildId)) queues.set(guildId, { player: null });
  return queues.get(guildId);
}

module.exports = {
  name: 'resume',
  description: 'Resume playback.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    if (!queue.player) {
      return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Nothing is paused.', color: 'Red' })] });
    }

    queue.player.unpause();
    return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Playback resumed.' })] });
  }
};
