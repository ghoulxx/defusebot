const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'antiraid', description: 'Configure antiraid settings (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
