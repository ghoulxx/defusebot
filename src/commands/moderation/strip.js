const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'strip', description: 'Remove all roles from a member (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
