const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'purgeimages', description: 'Purge messages with images. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
