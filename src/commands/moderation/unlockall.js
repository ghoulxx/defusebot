const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'unlockall', description: 'Unlock all channels. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
