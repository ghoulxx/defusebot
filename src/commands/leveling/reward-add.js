const LevelReward = require('../../models/LevelReward');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'levelreward',
  description: 'Add a role reward for a level.',
  aliases: [],
  async execute(message, args) {
    const level = Number(args[0]);
    const role = message.mentions.roles.first();
    if (!level || !role) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!levelreward <level> @role`.', color: 'Orange' })] });
    await LevelReward.findOneAndUpdate({ guildId: message.guild.id, level }, { roleId: role.id }, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Level reward saved', description: `Role ${role} will now be awarded at level ${level}.`, color: 'Green' })] });
  }
};
