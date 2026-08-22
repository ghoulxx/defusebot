const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'nuke', description: 'Clear and recreate channel. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
