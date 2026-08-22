const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'punishment', description: 'Configure punishment set (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
