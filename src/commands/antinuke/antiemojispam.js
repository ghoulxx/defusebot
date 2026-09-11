const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'antiemojispam',
  description: 'Protect against emoji spam.',
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
      const status = config?.antiemojispam ? 'Enabled' : 'Disabled';
      const threshold = config?.antiemojispamThreshold || 10;
      return message.reply({ embeds: [createEmbed({ title: 'Antiemojispam status', description: `Status: **${status}**\nThreshold: **${threshold}** emojis\n\nUse \`$antiemojispam on/off\` or \`$antiemojispam threshold <number>\`.`, color: 'Blue' })] });
    }

    if (action === 'on' || action === 'enable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antiemojispam: true }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antiemojispam enabled', description: 'Users posting too many emojis will be kicked.', color: 'Green' })] });
    }

    if (action === 'off' || action === 'disable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antiemojispam: false }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antiemojispam disabled', description: 'Antiemojispam protection is now off.', color: 'Orange' })] });
    }

    if (action === 'threshold' && args[1]) {
      const threshold = parseInt(args[1], 10);
      if (isNaN(threshold) || threshold < 1) {
        return message.reply({ embeds: [createEmbed({ title: 'Invalid threshold', description: 'Threshold must be a number >= 1', color: 'Red' })] });
      }
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antiemojispamThreshold: threshold }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antiemojispam threshold updated', description: `Threshold is now **${threshold}** emojis.`, color: 'Green' })] });
    }

    return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$antiemojispam on/off` or `$antiemojispam threshold <number>`', color: 'Orange' })] });
  }
};
