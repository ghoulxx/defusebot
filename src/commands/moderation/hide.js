const { PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'hide',
  description: 'Hide a channel from the @everyone role.',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Channels permission.', color: 'Red' })] });
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.id, { ViewChannel: false });
      return message.reply({ embeds: [createEmbed({ title: 'Channel hidden', description: 'This channel is now hidden from @everyone.', color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Hide failed', description: 'Unable to hide this channel.', color: 'Red' })] });
    }
  }
};
