const ReactionRole = require('../models/ReactionRole');

module.exports = {
  name: 'messageReactionAdd',
  async execute(client, reaction, user) {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();
    const roleConfig = await ReactionRole.findOne({ guildId: reaction.message.guild.id, messageId: reaction.message.id, emoji: reaction.emoji.id || reaction.emoji.name });
    if (!roleConfig) return;
    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;
    const role = reaction.message.guild.roles.cache.get(roleConfig.roleId);
    if (!role) return;
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role).catch(() => null);
    } else {
      await member.roles.add(role).catch(() => null);
    }
  }
};
