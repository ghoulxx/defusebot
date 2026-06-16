const { createEmbed } = require('../../utils/embed');
const { canActOn, botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'kick',
  description: 'Kick a member from the server.',
  aliases: [],
  async execute(message, args) {
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No reason provided';
    if (!target) return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'Mention a member to kick.', color: 'Red' })] });
    if (!canActOn(target, message.member)) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You cannot kick that member due to role hierarchy.', color: 'Red' })] });
    if (!botHasPermissions(message.channel, ['KickMembers'])) return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Kick Members permission.', color: 'Red' })] });
    try {
      await target.kick(reason);
      await message.reply({ embeds: [createEmbed({ title: 'Member kicked', description: `${target.user.tag} has been kicked.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Kick failed', description: 'Unable to kick that member.', color: 'Red' })] });
    }
  }
};
