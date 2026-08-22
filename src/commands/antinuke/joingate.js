const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'joingate', description: 'Configure join gating (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
