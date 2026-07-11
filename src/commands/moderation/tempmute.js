const { createEmbed } = require('../../utils/embed');
const { botHasPermissions, canActOn } = require('../../utils/permissions');
const { parseDuration } = require('../../utils/moderation');

module.exports = {
  name: 'tempmute',
  description: 'Temporarily timeout a member.',
  async execute(message, args) {
    const target = message.mentions.members.first();
    const durationText = args[1];
    const reason = args.slice(2).join(' ') || 'No reason provided';

    if (!target || !durationText) {
      return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$tempmute @user <duration> [reason]`.', color: 'Red' })] });
    }

    const durationMs = parseDuration(durationText);
    if (!durationMs || durationMs > 2419200000) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid duration', description: 'Use a duration like 10m, 2h, or 1d.', color: 'Red' })] });
    }

    if (!canActOn(target, message.member)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You cannot timeout that member due to role hierarchy.', color: 'Red' })] });
    }

    if (!botHasPermissions(message.channel, ['ModerateMembers'])) {
      return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Moderate Members permission.', color: 'Red' })] });
    }

    try {
      await target.timeout(durationMs, reason);
      return message.reply({ embeds: [createEmbed({ title: 'Member timed out', description: `${target.user.tag} has been timed out for ${durationText}.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Timeout failed', description: 'Unable to timeout that member.', color: 'Red' })] });
    }
  }
};
