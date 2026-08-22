const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'panic', description: 'Immediate server lockdown (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
