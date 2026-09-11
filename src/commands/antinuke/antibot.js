const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'antibot',
  description: 'Configure antibot protection.',
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
      const status = config?.antibot ? 'Enabled' : 'Disabled';
      return message.reply({ embeds: [createEmbed({ title: 'Antibot status', description: `Status: **${status}**\n\nUse \`$antibot on\` or \`$antibot off\` to toggle.`, color: 'Blue' })] });
    }

    if (action === 'on' || action === 'enable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antibot: true }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antibot enabled', description: 'The bot will now kick members who add bots without permission.', color: 'Green' })] });
    }

    if (action === 'off' || action === 'disable') {
      await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { antibot: false }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Antibot disabled', description: 'Antibot protection is now off.', color: 'Orange' })] });
    }

    return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$antibot on` or `$antibot off`', color: 'Orange' })] });
  }
};
