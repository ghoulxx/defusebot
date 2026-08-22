const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'purgeembeds', description: 'Purge messages with embeds. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
