const { createEmbed } = require('../../utils/embed');
const { getQueue } = require('./musicState');

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
