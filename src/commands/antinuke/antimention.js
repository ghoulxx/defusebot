const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'antimention',
  description: 'Protect against mass mentions.',
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
      const status = config?.antimention ? 'Enabled' : 'Disabled';
      const threshold = config?.antimentionThreshold || 5;
      return message.reply({ embeds: [createEmbed({ title: 'Antimention status', description: `Status: **${status}**\nThreshold: **${threshold}** mentions\n\nUse \`$antimention on/off\` or \`$antimention threshold <number>\`.`, color: 'Blue' })] });
    }

    if (action === 'on' || action === 'enable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antimention: true }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antimention enabled', description: 'Users posting messages with many mentions will be kicked.', color: 'Green' })] });
    }

    if (action === 'off' || action === 'disable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antimention: false }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antimention disabled', description: 'Antimention protection is now off.', color: 'Orange' })] });
    }

    if (action === 'threshold' && args[1]) {
      const threshold = parseInt(args[1], 10);
      if (isNaN(threshold) || threshold < 1) {
        return message.reply({ embeds: [createEmbed({ title: 'Invalid threshold', description: 'Threshold must be a number >= 1', color: 'Red' })] });
      }
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antimentionThreshold: threshold }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antimention threshold updated', description: `Threshold is now **${threshold}** mentions.`, color: 'Green' })] });
    }

    return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$antimention on/off` or `$antimention threshold <number>`', color: 'Orange' })] });
  }
};
