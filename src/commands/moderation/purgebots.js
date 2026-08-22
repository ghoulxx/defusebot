const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'purgebots', description: 'Purge messages by bots. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
