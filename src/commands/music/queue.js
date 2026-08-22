const { createEmbed } = require('../../utils/embed');
const { getQueue } = require('./musicState');

module.exports = {
  name: 'queue',
  description: 'Show the current music queue.',
  async execute(message) {
    const queue = getQueue(message.guild.id);
    const songs = queue.songs.slice(0, 10);
    const list = songs.length ? songs.map((song, index) => `${index + 1}. ${song.title}`).join('\n') : 'The queue is empty.';

    return message.reply({ embeds: [createEmbed({ title: 'Music Queue', description: list })] });
  }
};
