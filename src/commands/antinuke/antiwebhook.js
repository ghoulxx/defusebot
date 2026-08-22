const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'antiwebhook', description: 'Protect against webhook abuse (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
