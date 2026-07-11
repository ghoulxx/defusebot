const { createEmbed } = require('../../utils/embed');
const { canActOn, botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'undeafen',
  description: 'Undeafen a member in voice.',
  async execute(message) {
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'Mention a member to undeafen.', color: 'Red' })] });
    }

    if (!canActOn(target, message.member)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You cannot undeafen that member due to role hierarchy.', color: 'Red' })] });
    }

    if (!botHasPermissions(message.channel, ['DeafenMembers'])) {
      return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Deafen Members permission.', color: 'Red' })] });
    }

    try {
      await target.voice.setDeaf(false);
      return message.reply({ embeds: [createEmbed({ title: 'Member undeafened', description: `${target.user.tag} has been undeafened.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Undeafen failed', description: 'Unable to undeafen that member.', color: 'Red' })] });
    }
  }
};
