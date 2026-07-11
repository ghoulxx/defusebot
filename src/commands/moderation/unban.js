const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'unban',
  description: 'Unban a user from the server.',
  async execute(message, args) {
    const userId = args[0];
    if (!userId) {
      return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$unban <user-id>`.', color: 'Red' })] });
    }

    try {
      const user = await message.client.users.fetch(userId).catch(() => null);
      if (!user) {
        return message.reply({ embeds: [createEmbed({ title: 'User not found', description: 'I could not find that user.', color: 'Red' })] });
      }

      await message.guild.members.unban(user);
      return message.reply({ embeds: [createEmbed({ title: 'User unbanned', description: `${user.tag} has been unbanned.`, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Unban failed', description: 'Unable to unban that user.', color: 'Red' })] });
    }
  }
};
