const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'lockdown', description: 'Lockdown server (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
