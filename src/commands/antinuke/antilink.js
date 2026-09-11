const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'antilink',
  description: 'Configure antilink protection.',
  async execute(message, args) {
    const member = message.member;
    const isOwner = member.id === message.guild.ownerId;
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator, true);
    if (!isOwner && !isAdmin) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'Only server owner or administrators can use this.', color: 'Red' })] });
    }

    const action = args[0]?.toLowerCase();
    const config = await AntinukeConfig.findOne({ guildId: message.guild.id });

    if (!action) {
      const status = config?.antilink ? 'Enabled' : 'Disabled';
      const threshold = config?.antilinkThreshold || 5;
      return message.reply({ embeds: [createEmbed({ title: 'Antilink status', description: `Status: **${status}**\nThreshold: **${threshold}** links\n\nUse \`$antilink on/off\` or \`$antilink threshold <number>\`.`, color: 'Blue' })] });
    }

    if (action === 'on' || action === 'enable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antilink: true }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antilink enabled', description: 'Discord invite links will be flagged and offenders will be kicked.', color: 'Green' })] });
    }

    if (action === 'off' || action === 'disable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antilink: false }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antilink disabled', description: 'Antilink protection is now off.', color: 'Orange' })] });
    }

    if (action === 'threshold' && args[1]) {
      const threshold = parseInt(args[1], 10);
      if (isNaN(threshold) || threshold < 1) {
        return message.reply({ embeds: [createEmbed({ title: 'Invalid threshold', description: 'Threshold must be a number >= 1', color: 'Red' })] });
      }
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antilinkThreshold: threshold }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antilink threshold updated', description: `Threshold is now **${threshold}** links.`, color: 'Green' })] });
    }

    return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$antilink on/off` or `$antilink threshold <number>`', color: 'Orange' })] });
  }
};
