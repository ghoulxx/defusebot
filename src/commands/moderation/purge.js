const { createEmbed } = require('../../utils/embed');
const { botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'purge',
  description: 'Bulk delete messages in this channel.',
  aliases: ['clear'],
  async execute(message, args) {
    const amount = Number(args[0]);
    if (!amount || amount < 1 || amount > 100) return message.reply({ embeds: [createEmbed({ title: 'Invalid amount', description: 'Use a number between 1 and 100.', color: 'Red' })] });
    if (!botHasPermissions(message.channel, ['ManageMessages'])) return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Manage Messages permission.', color: 'Red' })] });
    try {
      const deleted = await message.channel.bulkDelete(amount, true);
      return message.reply({ embeds: [createEmbed({ title: 'Messages purged', description: `Deleted ${deleted.size} messages.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Purge failed', description: 'Unable to delete messages.', color: 'Red' })] });
    }
  }
};
