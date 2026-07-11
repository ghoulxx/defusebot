const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');
const { memberHasPermissions } = require('../../utils/permissions');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'jail',
  description: 'Jail or unjail a member, or set the jail role. Usage: $jail @user [reason], $jail unjail @user, $jail setrole @role',
  async execute(message, args) {
    const guildId = message.guild.id;
    const guildConfig = await GuildConfig.findOne({ guildId });

    const sub = args[0]?.toLowerCase();
    if (sub === 'setrole') {
      if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageRoles)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Roles to set the jail role.', color: 'Red' })] });
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if (!role) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Mention a role to set as the jail role.', color: 'Orange' })] });
      await GuildConfig.findOneAndUpdate({ guildId }, { jailRoleId: role.id }, { upsert: true });
      return message.reply({ embeds: [createEmbed({ title: 'Jail role set', description: `Jail role is now ${role}.`, color: 'Green' })] });
    }

    if (sub === 'unjail') {
      if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageRoles)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Roles to unjail.', color: 'Red' })] });
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
      if (!member) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Mention a member to unjail.', color: 'Orange' })] });
      const roleId = guildConfig?.jailRoleId;
      if (roleId && member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId).catch(() => null);
        return message.reply({ embeds: [createEmbed({ title: 'Unjailed', description: `${member} has been unjailed.`, color: 'Green' })] });
      }
      return message.reply({ embeds: [createEmbed({ title: 'Not jailed', description: 'That member does not appear to be jailed.', color: 'Orange' })] });
    }

    // Jail member
    if (!memberHasPermissions(message.member, PermissionsBitField.Flags.ManageRoles)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You need Manage Roles to jail members.', color: 'Red' })] });
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Mention a member to jail. Example: `$jail @user Spamming`', color: 'Orange' })] });
    const roleId = guildConfig?.jailRoleId;
    if (!roleId) return message.reply({ embeds: [createEmbed({ title: 'Jail role not set', description: 'Set a jail role first with `$jail setrole @role`.', color: 'Orange' })] });
    const role = message.guild.roles.cache.get(roleId);
    if (!role) return message.reply({ embeds: [createEmbed({ title: 'Role missing', description: 'Configured jail role was not found. Please set it again.', color: 'Red' })] });

    const reason = args.slice(1).join(' ') || 'No reason provided';
    await member.roles.add(role).catch(() => null);

    // Audit log
    if (guildConfig?.auditLogChannelId) {
      const ch = message.guild.channels.cache.get(guildConfig.auditLogChannelId) || await message.guild.channels.fetch(guildConfig.auditLogChannelId).catch(() => null);
      if (ch) ch.send({ embeds: [createEmbed({ title: 'Member Jailed', fields: [ { name: 'Member', value: `${member.user.tag} (${member.id})` }, { name: 'Moderator', value: `${message.author.tag} (${message.author.id})` }, { name: 'Reason', value: reason } ], timestamp: new Date() })] }).catch(() => null);
    }

    return message.reply({ embeds: [createEmbed({ title: 'Member jailed', description: `${member} has been jailed.`, color: 'Green' })] });
  }
};
