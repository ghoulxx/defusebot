const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'tempban', description: 'Temporarily ban a user. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
