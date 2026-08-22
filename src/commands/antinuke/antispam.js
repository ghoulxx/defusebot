const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'antispam', description: 'Configure antispam protection (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
