const UserLevel = require('../../models/UserLevel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'level',
  description: 'Check your level and experience.',
  aliases: [],
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const record = await UserLevel.findOne({ guildId: message.guild.id, userId: user.id }) || { xp: 0, level: 0 };
    return message.reply({ embeds: [createEmbed({ title: `${user.username}'s Level`, fields: [{ name: 'Level', value: `${record.level}`, inline: true }, { name: 'XP', value: `${record.xp}`, inline: true }] })] });
  }
};
