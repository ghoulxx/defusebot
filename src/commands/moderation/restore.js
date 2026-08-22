const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'restore', description: 'Restore previously removed roles (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
