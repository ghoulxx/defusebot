const { createEmbed } = require('../../utils/embed');
const { botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'slowmode',
  description: 'Set slowmode for the current channel.',
  async execute(message, args) {
    if (!botHasPermissions(message.channel, ['ManageChannels'])) {
      return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Manage Channels permission.', color: 'Red' })] });
    }

    const value = Number(args[0]);
    if (!Number.isFinite(value) || value < 0 || value > 21600) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid slowmode', description: 'Use a number between 0 and 21600 seconds.', color: 'Red' })] });
    }

    try {
      await message.channel.setRateLimitPerUser(value);
      return message.reply({ embeds: [createEmbed({ title: 'Slowmode updated', description: value === 0 ? 'Slowmode has been disabled.' : `Slowmode set to ${value} seconds.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Slowmode failed', description: 'Unable to update slowmode.', color: 'Red' })] });
    }
  }
};
