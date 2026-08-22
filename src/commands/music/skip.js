const { createEmbed } = require('../../utils/embed');
const { getQueue, resetPlayback } = require('./musicState');

module.exports = {
  name: 'skip',
  description: 'Skip the current track.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    if (!queue.player) {
      return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Nothing is playing right now.', color: 'Red' })] });
    }

    queue.player.stop();
    resetPlayback(message.guild.id);
    return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Skipped the current track.' })] });
  }
};
