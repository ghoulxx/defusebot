const EconomyUser = require('../../models/EconomyUser');
const { checkCooldown } = require('../../utils/cooldown');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'coinflip',
  description: 'Flip a coin and win or lose money.',
  aliases: [],
  async execute(message, args) {
    const wager = Number(args[0]);
    if (!wager || wager <= 0) return message.reply({ embeds: [createEmbed({ title: 'Invalid wager', description: 'Provide a positive amount.', color: 'Red' })] });
    const cooldownKey = `${message.guild.id}-${message.author.id}-coinflip`;
    const remaining = checkCooldown(cooldownKey, 20);
    if (remaining) return message.reply({ embeds: [createEmbed({ title: 'Cooldown', description: `Wait ${remaining}s before flipping again.`, color: 'Orange' })] });
    let record = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record || record.wallet < wager) return message.reply({ embeds: [createEmbed({ title: 'Insufficient funds', description: 'You do not have enough money in your wallet.', color: 'Red' })] });
    const outcome = Math.random() < 0.5;
    if (outcome) {
      record.wallet += wager;
      await record.save();
      return message.reply({ embeds: [createEmbed({ title: 'Coinflip won', description: `You won $${wager}!`, color: 'Green' })] });
    }
    record.wallet -= wager;
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Coinflip lost', description: `You lost $${wager}.`, color: 'Red' })] });
  }
};
