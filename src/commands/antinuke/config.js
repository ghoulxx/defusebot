const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');
const { normalizePunishment, parseAntinukeAction } = require('../../utils/antinukeConfig');

module.exports = {
  name: 'antinuke',
  description: 'Configure antinuke protection for this guild.',
  aliases: ['antinukeconfig'],
  async execute(message, args) {
    const member = message.member;
    const isOwner = member.id === message.guild.ownerId;
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator, true);
    if (!isOwner && !isAdmin) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'Only the server owner or administrators can manage antinuke settings.', color: 'Red' })] });
    }

    const action = parseAntinukeAction(args);

    if (action.type === 'toggle') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { enabled: action.enabled }, { upsert: true, new: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antinuke updated', description: `Antinuke protection has been ${action.enabled ? 'enabled' : 'disabled'}.`, color: 'Green' })] });
    }

    if (action.type === 'punishment') {
      const validKeys = ['massRoleCreate', 'massRoleDelete', 'massChannelCreate', 'massChannelDelete', 'botAdd'];
      if (!validKeys.includes(action.key)) {
        return message.reply({ embeds: [createEmbed({ title: 'Invalid punishment key', description: `Use one of: ${validKeys.join(', ')}`, color: 'Orange' })] });
      }

      const config = await AntinukeConfig.findOne({ guildId: message.guild.id });
      const punishments = { ...(config?.punishments || {}) };
      punishments[action.key] = normalizePunishment(action.value);
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { punishments }, { upsert: true, new: true });
      return message.reply({ embeds: [createEmbed({ title: 'Punishment updated', description: `Antinuke ${action.key} now uses **${punishments[action.key]}**.`, color: 'Green' })] });
    }

    return message.reply({ embeds: [createEmbed({
      title: 'Antinuke usage',
      description: [
        'Use `!antinuke on` or `!antinuke off`',
        'Use `!antinuke punishment massRoleCreate ban`',
        'Use `!antinuke punishment botAdd kick`',
        'Use `!trustedlist add @user` or `!trustedlist add @role`'
      ].join('\n'),
      color: 'Orange'
    })] });
  }
};
