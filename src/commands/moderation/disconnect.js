const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'disconnect', description: 'Disconnect a user from voice (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
