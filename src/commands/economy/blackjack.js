const EconomyUser = require('../../models/EconomyUser');
const { checkCooldown } = require('../../utils/cooldown');
const { createEmbed } = require('../../utils/embed');

function rollCard() {
  return Math.floor(Math.random() * 10) + 2;
}

module.exports = {
  name: 'blackjack',
  description: 'Play a simple blackjack wager.',
  aliases: ['bj'],
  async execute(message, args) {
    const wager = Number(args[0]);
    if (!wager || wager <= 0) return message.reply({ embeds: [createEmbed({ title: 'Invalid wager', description: 'Provide a positive amount.', color: 'Red' })] });
    const cooldownKey = `${message.guild.id}-${message.author.id}-blackjack`;
    const remaining = checkCooldown(cooldownKey, 30);
    if (remaining) return message.reply({ embeds: [createEmbed({ title: 'Cooldown', description: `Wait ${remaining}s before playing again.`, color: 'Orange' })] });
    const record = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record || record.wallet < wager) return message.reply({ embeds: [createEmbed({ title: 'Insufficient funds', description: 'You do not have enough money in your wallet.', color: 'Red' })] });
    const player = rollCard() + rollCard();
    const dealer = rollCard() + rollCard();
    if (player > dealer) {
      const winnings = Math.floor(wager * 1.5);
      record.wallet += winnings;
      await record.save();
      return message.reply({ embeds: [createEmbed({ title: 'Blackjack win', description: `You got ${player} and dealer got ${dealer}. You win $${winnings}!`, color: 'Green' })] });
    }
    record.wallet -= wager;
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Blackjack loss', description: `You got ${player} and dealer got ${dealer}. You lost $${wager}.`, color: 'Red' })] });
  }
};
