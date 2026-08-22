const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'kickall', description: 'Kick all members. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
