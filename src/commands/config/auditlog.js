const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');
const { memberHasPermissions } = require('../../utils/permissions');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'auditlog',
  description: 'Configure the audit log channel. Usage: $auditlog set #channel | $auditlog show | $auditlog clear',
  async execute(message, args) {
    if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageGuild)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Server to configure audit logs.', color: 'Red' })] });
    const guildId = message.guild.id;
    const sub = args[0]?.toLowerCase();
    if (sub === 'set') {
      const ch = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
      if (!ch) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Mention a channel to set as audit log.', color: 'Orange' })] });
      await GuildConfig.findOneAndUpdate({ guildId }, { auditLogChannelId: ch.id }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Audit log set', description: `Audit log channel set to ${ch}.`, color: 'Green' })] });
    }

    if (sub === 'clear') {
      await GuildConfig.findOneAndUpdate({ guildId }, { auditLogChannelId: null }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Audit log cleared', description: 'Audit log channel has been cleared.', color: 'Green' })] });
    }

    // show
    const cfg = await GuildConfig.findOne({ guildId });
    const id = cfg?.auditLogChannelId;
    if (!id) return message.reply({ embeds: [createEmbed({ title: 'Audit log', description: 'No audit log channel configured.', color: 'Orange' })] });
    const ch = message.guild.channels.cache.get(id) || await message.guild.channels.fetch(id).catch(() => null);
    return message.reply({ embeds: [createEmbed({ title: 'Audit log', description: `Audit log channel: ${ch || 'Not found for configured id'}` })] });
  }
};
