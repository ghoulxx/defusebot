const { createEmbed } = require('../../utils/embed');
const { botHasPermissions, canActOn } = require('../../utils/permissions');

module.exports = {
  name: 'unmute',
  description: 'Remove a timeout from a member.',
  async execute(message, args) {
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'Mention a member to unmute.', color: 'Red' })] });
    }

    if (!canActOn(target, message.member)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You cannot unmute that member due to role hierarchy.', color: 'Red' })] });
    }

    if (!botHasPermissions(message.channel, ['ModerateMembers'])) {
      return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Moderate Members permission.', color: 'Red' })] });
    }

    try {
      await target.timeout(null);
      return message.reply({ embeds: [createEmbed({ title: 'Member unmuted', description: `${target.user.tag} is no longer timed out.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Unmute failed', description: 'Unable to remove the timeout.', color: 'Red' })] });
    }
  }
};
