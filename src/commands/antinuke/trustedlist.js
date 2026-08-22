const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');
const { parseTrustedTarget } = require('../../utils/antinukeConfig');

module.exports = {
  name: 'trustedlist',
  description: 'Manage trusted users and roles for antinuke.',
  aliases: ['trusted'],
  async execute(message, args) {
    const member = message.member;
    const isOwner = member.id === message.guild.ownerId;
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator, true);
    if (!isOwner && !isAdmin) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'Only the server owner or admin can manage the trusted list.', color: 'Red' })] });
    }

    const [action, ...rest] = args;
    const target = rest.join(' ');
    const parsedTarget = parseTrustedTarget(target);
    if (!action || !['add', 'remove', 'list'].includes(action.toLowerCase())) {
      return message.reply({ embeds: [createEmbed({ title: 'Trusted list usage', description: 'Use `!trustedlist add @user`, `!trustedlist remove @user`, or `!trustedlist list`.', color: 'Orange' })] });
    }

    const config = await AntinukeConfig.findOne({ guildId: message.guild.id }) || new AntinukeConfig({ guildId: message.guild.id });
    if (action.toLowerCase() === 'list') {
      const users = (config.whitelistUserIds || []).map(id => `<@${id}>`).join(', ') || 'None';
      const roles = (config.whitelistRoleIds || []).map(id => `<@&${id}>`).join(', ') || 'None';
      return message.reply({ embeds: [createEmbed({ title: 'Trusted list', description: `Users: ${users}\nRoles: ${roles}`, color: 'Blue' })] });
    }

    if (!parsedTarget) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'Mention a user or role, or provide a valid user/role ID.', color: 'Red' })] });
    }

    const isRole = target.includes('&') || message.mentions.roles.has(parsedTarget);
    if (action.toLowerCase() === 'add') {
      if (isRole) {
        const roleList = config.whitelistRoleIds || [];
        if (!roleList.includes(parsedTarget)) roleList.push(parsedTarget);
        config.whitelistRoleIds = roleList;
      } else {
        const userList = config.whitelistUserIds || [];
        if (!userList.includes(parsedTarget)) userList.push(parsedTarget);
        config.whitelistUserIds = userList;
      }
      await config.save();
      return message.reply({ embeds: [createEmbed({ title: 'Trusted target added', description: `Added ${target} to the antinuke trusted list.`, color: 'Green' })] });
    }

    if (isRole) {
      config.whitelistRoleIds = (config.whitelistRoleIds || []).filter(id => id !== parsedTarget);
    } else {
      config.whitelistUserIds = (config.whitelistUserIds || []).filter(id => id !== parsedTarget);
    }
    await config.save();
    return message.reply({ embeds: [createEmbed({ title: 'Trusted target removed', description: `Removed ${target} from the antinuke trusted list.`, color: 'Green' })] });
  }
};
