const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'massban', description: 'Mass ban users. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
