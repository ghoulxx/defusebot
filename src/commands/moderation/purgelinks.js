const { createEmbed } = require('../../utils/embed');
module.exports = { name: 'purgelinks', description: 'Purge messages with links. (stub)', async execute(message){ return message.reply({ embeds: [createEmbed({ title: 'Not implemented', description: 'This command is a stub.' })] }); } };
