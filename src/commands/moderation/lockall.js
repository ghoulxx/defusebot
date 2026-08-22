const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'lockall', description: 'Lock all channels. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
