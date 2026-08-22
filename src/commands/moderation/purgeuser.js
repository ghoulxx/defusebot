const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'purgeuser', description: 'Purge messages from a user. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
