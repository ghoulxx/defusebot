const { createEmbed } = require('../../utils/embed');
const { clearQueue, getQueue } = require('./musicState');

module.exports = {
  name: 'stop',
  description: 'Stop playback and clear the queue.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    if (queue.player) queue.player.stop();
    if (queue.connection) queue.connection.destroy();
    clearQueue(message.guild.id);
    return message.reply({ embeds: [createEmbed({ title: 'Music', description: 'Playback stopped and queue cleared.' })] });
  }
};
