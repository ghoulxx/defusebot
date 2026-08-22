const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'note', description: 'Add a moderator note to a user (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
