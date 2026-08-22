const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'notes', description: 'List moderator notes for a user (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
