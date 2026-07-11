const { PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'unhide',
  description: 'Unhide a channel for the @everyone role.',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Channels permission.', color: 'Red' })] });
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: null });
      return message.reply({ embeds: [createEmbed({ title: 'Channel shown', description: 'This channel is now visible again.', color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Unhide failed', description: 'Unable to show this channel.', color: 'Red' })] });
    }
  }
};
