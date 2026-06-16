const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'diagnose',
  description: 'Report bot status, permissions, and current prefix.',
  aliases: ['diag', 'status'],
  async execute(message) {
    const client = message.client;
    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id });
    const prefix = guildConfig?.prefix || '$';

    const botOnline = client.user ? `Online as ${client.user.tag}` : 'Offline';

    const required = [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.EmbedLinks
    ];

    const botMember = message.guild.members.me;
    const perms = botMember ? message.channel.permissionsFor(botMember) : null;
    const missing = [];
    if (!perms) missing.push('No guild/channel permissions available');
    else {
      for (const p of required) {
        if (!perms.has(p)) missing.push(PermissionsBitField.resolve(p));
      }
    }

    const desc = `**Status:** ${botOnline}\n**Current prefix:** \`${prefix}\`\n**Channel:** ${message.channel} (${message.channel.id})\n**Missing permissions:** ${missing.length ? missing.join(', ') : 'None'}`;

    return message.reply({ embeds: [createEmbed({ title: 'Diagnostic', description: desc })] });
  }
};
