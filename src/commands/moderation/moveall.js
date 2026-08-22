const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'moveall', description: 'Move all users to a channel (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
