const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'twofa', description: 'Require 2FA for admins (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
