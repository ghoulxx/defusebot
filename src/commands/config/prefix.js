const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');
const { memberHasPermissions } = require('../../utils/permissions');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'prefix',
  description: 'Get or set the server command prefix.',
  aliases: ['setprefix'],
  async execute(message, args) {
    const guildId = message.guild.id;
    const guildConfig = await GuildConfig.findOne({ guildId });
    const current = guildConfig?.prefix || '$';

    if (!args.length) {
      return message.reply({ embeds: [createEmbed({ title: 'Prefix', description: `Current prefix: \`${current}\`` })] });
    }

    if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need the Manage Server permission to change the prefix.', color: 'Red' })] });
    }

    const newPrefix = args[0];
    await GuildConfig.findOneAndUpdate({ guildId }, { prefix: newPrefix }, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Prefix updated', description: `New prefix: \`${newPrefix}\``, color: 'Green' })] });
  }
};
