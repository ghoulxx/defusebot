const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'antinuke',
  description: 'Enable or disable antinuke protection.',
  aliases: [],
  async execute(message, args) {
    const member = message.member;
    const isOwner = member.id === message.guild.ownerId;
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator, true);
    if (!isOwner && !isAdmin) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'Only the server owner or administrators can toggle antinuke protection.', color: 'Red' })] });
    }

    const option = args[0]?.toLowerCase();
    if (!['on', 'off'].includes(option)) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!antinuke on` or `!antinuke off`.', color: 'Orange' })] });
    const enabled = option === 'on';
    await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { enabled }, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Antinuke updated', description: `Antinuke protection has been ${enabled ? 'enabled' : 'disabled'}.`, color: 'Green' })] });
  }
};
