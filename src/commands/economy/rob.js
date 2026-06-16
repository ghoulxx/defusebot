const EconomyUser = require('../../models/EconomyUser');
const { checkCooldown } = require('../../utils/cooldown');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'rob',
  description: 'Rob another user.',
  aliases: [],
  async execute(message) {
    const target = message.mentions.users.first();
    if (!target || target.id === message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!rob @user`.', color: 'Orange' })] });
    const cooldownKey = `${message.guild.id}-${message.author.id}-rob`;
    const remaining = checkCooldown(cooldownKey, 1800);
    if (remaining) {
      return message.reply({ embeds: [createEmbed({ title: 'Cooldown', description: `You must wait ${remaining}s before robbing again.`, color: 'Orange' })] });
    }
    const targetRecord = await EconomyUser.findOne({ guildId: message.guild.id, userId: target.id });
    const thiefRecord = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!targetRecord || targetRecord.wallet < 100) return message.reply({ embeds: [createEmbed({ title: 'Too risky', description: 'That user has too little money to rob.', color: 'Red' })] });
    if (!thiefRecord || thiefRecord.wallet < 20) return message.reply({ embeds: [createEmbed({ title: 'No funds', description: 'You need money in your wallet to rob.', color: 'Red' })] });
    const success = Math.random() < 0.4;
    if (!success) {
      const loss = Math.min(thiefRecord.wallet, Math.floor(Math.random() * 50) + 20);
      thiefRecord.wallet -= loss;
      await thiefRecord.save();
      return message.reply({ embeds: [createEmbed({ title: 'Robbery failed', description: `You were caught and lost $${loss}.`, color: 'Red' })] });
    }
    const amount = Math.min(targetRecord.wallet, Math.floor(Math.random() * 150) + 50);
    targetRecord.wallet -= amount;
    thiefRecord.wallet += amount;
    await targetRecord.save();
    await thiefRecord.save();
    return message.reply({ embeds: [createEmbed({ title: 'Robbery success', description: `You stole $${amount} from ${target.tag}.`, color: 'Green' })] });
  }
};
