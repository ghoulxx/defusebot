const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');
const { memberHasPermissions } = require('../../utils/permissions');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'messagelog',
  description: 'Configure message logging. Usage: $messagelog set #channel | $messagelog on|off | $messagelog show',
  async execute(message, args) {
    if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageGuild)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Server to configure message logging.', color: 'Red' })] });
    const guildId = message.guild.id;
    const sub = args[0]?.toLowerCase();
    if (sub === 'set') {
      const ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
      if (!ch) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Mention a channel to set as message log.', color: 'Orange' })] });
      await GuildConfig.findOneAndUpdate({ guildId }, { messageLogChannelId: ch.id }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Message log set', description: `Message log channel set to ${ch}.`, color: 'Green' })] });
    }

    if (sub === 'on' || sub === 'off') {
      const enabled = sub === 'on';
      await GuildConfig.findOneAndUpdate({ guildId }, { messageLoggingEnabled: enabled }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Message logging', description: `Message logging turned **${enabled ? 'ON' : 'OFF'}**.`, color: 'Green' })] });
    }

    const cfg = await GuildConfig.findOne({ guildId });
    const description = `Enabled: **${cfg?.messageLoggingEnabled ? 'YES' : 'NO'}**\nChannel: ${cfg?.messageLogChannelId ? `<#${cfg.messageLogChannelId}>` : 'Not set'}`;
    return message.reply({ embeds: [createEmbed({ title: 'Message logging', description })] });
  }
};
