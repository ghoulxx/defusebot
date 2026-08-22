const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'antimention', description: 'Protect against mass mentions (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
