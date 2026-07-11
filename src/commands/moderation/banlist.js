const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'banlist',
  description: 'List banned users for this server.',
  async execute(message) {
    try {
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0) {
        return message.reply({ embeds: [createEmbed({ title: 'Ban list', description: 'No users are currently banned.', color: 'Green' })] });
      }

      const list = bans.map((ban) => `• ${ban.user.tag}`).slice(0, 20).join('\n');
      return message.reply({ embeds: [createEmbed({ title: 'Ban list', description: list, color: 'Green' })] });
    } catch {
      return message.reply({ embeds: [createEmbed({ title: 'Ban list failed', description: 'Unable to retrieve the ban list.', color: 'Red' })] });
    }
  }
};
