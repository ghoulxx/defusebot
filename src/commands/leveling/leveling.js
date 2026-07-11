const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');
const { memberHasPermissions } = require('../../utils/permissions');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'leveling',
  description: 'Enable or disable the leveling system for this server.',
  aliases: ['levels', 'xp'],
  async execute(message, args) {
    const guildId = message.guild.id;
    const guildConfig = await GuildConfig.findOne({ guildId });
    const current = guildConfig?.levelingEnabled ?? true;

    if (!args.length) {
      return message.reply({ embeds: [createEmbed({ title: 'Leveling', description: `Leveling is currently **${current ? 'ON' : 'OFF'}** for this server.` })] });
    }

    if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need the Manage Server permission to change leveling settings.', color: 'Red' })] });
    }

    const sub = args[0].toLowerCase();
    if (sub !== 'on' && sub !== 'off') {
      return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$leveling on` or `$leveling off` to change the setting.', color: 'Orange' })] });
    }

    const enabled = sub === 'on';
    await GuildConfig.findOneAndUpdate({ guildId }, { levelingEnabled: enabled }, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Leveling updated', description: `Leveling has been turned **${enabled ? 'ON' : 'OFF'}**.`, color: 'Green' })] });
  }
};
