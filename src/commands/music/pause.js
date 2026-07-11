const { createEmbed } = require('../../utils/embed');

const queues = new Map();
function getQueue(guildId) {
  if (!queues.has(guildId)) queues.set(guildId, { player: null });
  return queues.get(guildId);
}

module.exports = {
  name: 'pause',
  description: 'Pause the current track.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    if (!queue.player) {
      return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Nothing is playing.', color: 'Red' })] });
    }

    queue.player.pause();
    return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Playback paused.' })] });
  }
};
