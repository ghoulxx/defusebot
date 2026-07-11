const { createEmbed } = require('../../utils/embed');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
  name: 'serverinfo',
  description: 'Show information about the server.',
  async execute(message) {
    const guild = message.guild;
    const owner = await guild.fetchOwner().catch(() => null);
    const channels = guild.channels.cache;
    const roles = guild.roles.cache;
    const cfg = await GuildConfig.findOne({ guildId: guild.id });

    const fields = [
      { name: 'Name', value: guild.name, inline: true },
      { name: 'ID', value: guild.id, inline: true },
      { name: 'Owner', value: owner ? `${owner.user.tag}` : 'Unknown', inline: true },
      { name: 'Members', value: `${guild.memberCount}`, inline: true },
      { name: 'Channels', value: `${channels.size}`, inline: true },
      { name: 'Roles', value: `${roles.size}`, inline: true },
      { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Prefix', value: cfg?.prefix || '$', inline: true },
      { name: 'Leveling', value: cfg?.levelingEnabled ? 'ON' : 'OFF', inline: true },
      { name: 'Message Logging', value: cfg?.messageLoggingEnabled ? `ON (${cfg.messageLogChannelId ? `<#${cfg.messageLogChannelId}>` : 'channel not set'})` : 'OFF', inline: true }
    ];

    if (cfg?.auditLogChannelId) fields.push({ name: 'Audit Log', value: cfg.auditLogChannelId ? `<#${cfg.auditLogChannelId}>` : 'Not set', inline: true });
    if (cfg?.jailRoleId) fields.push({ name: 'Jail Role', value: cfg.jailRoleId ? `<@&${cfg.jailRoleId}>` : 'Not set', inline: true });

    return message.reply({ embeds: [createEmbed({ title: `Server Info — ${guild.name}`, fields })] });
  }
};
