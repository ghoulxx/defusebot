const { PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'lock',
  description: 'Lock a channel from sending messages.',
  async execute(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Channels permission.', color: 'Red' })] });
    }

    try {
      await message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false });
      return message.reply({ embeds: [createEmbed({ title: 'Channel locked', description: 'This channel is now locked.', color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Lock failed', description: 'Unable to lock this channel.', color: 'Red' })] });
    }
  }
};
