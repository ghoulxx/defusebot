const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'antiemojispam', description: 'Protect against emoji spam (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
