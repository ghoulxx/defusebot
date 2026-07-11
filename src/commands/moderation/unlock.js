const { PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'unlock',
  description: 'Unlock a channel for sending messages.',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Channels permission.', color: 'Red' })] });
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: null });
      return message.reply({ embeds: [createEmbed({ title: 'Channel unlocked', description: 'This channel is now unlocked.', color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Unlock failed', description: 'Unable to unlock this channel.', color: 'Red' })] });
    }
  }
};
