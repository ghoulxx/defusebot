const UserLevel = require('../../models/UserLevel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'leaderboard',
  description: 'Show the server level leaderboard.',
  aliases: ['lb'],
  async execute(message) {
    const top = await UserLevel.find({ guildId: message.guild.id }).sort({ xp: -1 }).limit(10);
    if (!top.length) {
      return message.reply({ embeds: [createEmbed({ title: 'Leaderboard', description: 'No leveling data yet.' })] });
    }
    const description = top
      .map((record, index) => `**${index + 1}.** <@${record.userId}> — Level ${record.level} (${record.xp} XP)`)
      .join('\n');
    return message.reply({ embeds: [createEmbed({ title: 'Leaderboard', description })] });
  }
};
