const EconomyUser = require('../../models/EconomyUser');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'withdraw',
  description: 'Withdraw money from your bank.',
  aliases: [],
  async execute(message, args) {
    const amount = Number(args[0]);
    if (!amount || amount <= 0) return message.reply({ embeds: [createEmbed({ title: 'Invalid withdrawal', description: 'Provide a positive amount.', color: 'Red' })] });
    let record = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record || record.bank < amount) return message.reply({ embeds: [createEmbed({ title: 'Insufficient funds', description: 'You do not have enough money in your bank.', color: 'Red' })] });
    record.bank -= amount;
    record.wallet += amount;
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Withdraw complete', description: `Withdrew $${amount} to your wallet.`, color: 'Green' })] });
  }
};
