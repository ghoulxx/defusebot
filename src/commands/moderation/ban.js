const { createEmbed } = require('../../utils/embed');
const { canActOn, botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the server.',
  aliases: [],
  async execute(message, args) {
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No reason provided';
    if (!target) return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'Mention a member to ban.', color: 'Red' })] });
    if (!canActOn(target, message.member)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You cannot ban that member due to role hierarchy.', color: 'Red' })] });
    if (!botHasPermissions(message.channel, ['BanMembers'])) return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Ban Members permission.', color: 'Red' })] });
    try {
      await target.ban({ reason });
      await message.reply({ embeds: [createEmbed({ title: 'Member banned', description: `${target.user.tag} has been banned.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Ban failed', description: 'Unable to ban that member.', color: 'Red' })] });
    }
  }
};
