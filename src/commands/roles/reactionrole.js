const ReactionRole = require('../../models/ReactionRole');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'reactionrole',
  description: 'Bind an emoji to a role on a message.',
  aliases: [],
  async execute(message, args) {
    const emoji = args[0];
    const role = message.mentions.roles.first();
    const messageId = args[2];
    if (!emoji || !role || !messageId) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!reactionrole <emoji> @role <message-id>`.', color: 'Orange' })] });
    await ReactionRole.create({ guildId: message.guild.id, messageId, emoji, roleId: role.id });
    return message.reply({ embeds: [createEmbed({ title: 'Reaction role saved', description: `React to the message with ${emoji} to toggle ${role}.`, color: 'Green' })] });
  }
};
