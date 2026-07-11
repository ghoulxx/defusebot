const { createEmbed } = require('../../utils/embed');
const { botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'clean',
  description: 'Delete recent messages from this channel.',
  async execute(message, args) {
    const amount = Number(args[0]);
    if (!amount || amount < 1 || amount > 100) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid amount', description: 'Use a number between 1 and 100.', color: 'Red' })] });
    }

    if (!botHasPermissions(message.channel, ['ManageMessages'])) {
      return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Manage Messages permission.', color: 'Red' })] });
    }

    try {
      const deleted = await message.channel.bulkDelete(amount, true);
      return message.reply({ embeds: [createEmbed({ title: 'Messages cleaned', description: `Deleted ${deleted.size} messages.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Clean failed', description: 'Unable to delete messages.', color: 'Red' })] });
    }
  }
};
