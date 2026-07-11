const { createEmbed } = require('../../utils/embed');
const { canActOn, botHasPermissions } = require('../../utils/permissions');

module.exports = {
  name: 'deafen',
  description: 'Deafen a member in voice.',
  async execute(message) {
    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'Mention a member to deafen.', color: 'Red' })] });
    }

    if (!canActOn(target, message.member)) {
      return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'You cannot deafen that member due to role hierarchy.', color: 'Red' })] });
    }

    if (!botHasPermissions(message.channel, ['DeafenMembers'])) {
      return message.reply({ embeds: [createEmbed({ title: 'Missing permissions', description: 'I need Deafen Members permission.', color: 'Red' })] });
    }

    try {
      await target.voice.setDeaf(true);
      return message.reply({ embeds: [createEmbed({ title: 'Member deafened', description: `${target.user.tag} has been deafened.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Deafen failed', description: 'Unable to deafen that member.', color: 'Red' })] });
    }
  }
};
