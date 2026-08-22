const { createEmbed } = require('../../utils/embed');
const { getQueue } = require('./musicState');

module.exports = {
  name: 'nowplaying',
  description: 'Show the current track.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    if (!queue.current) {
      return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Nothing is playing right now.', color: 'Red' })] });
    }

    return message.reply({ embeds: [createEmbed({ title: 'Now Playing', description: queue.current.title })] });
  }
};
