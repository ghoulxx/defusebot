const EconomyUser = require('../../models/EconomyUser');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'deposit',
  description: 'Deposit money into your bank.',
  aliases: [],
  async execute(message, args) {
    const amount = Number(args[0]);
    if (!amount || amount <= 0) return message.reply({ embeds: [createEmbed({ title: 'Invalid deposit', description: 'Provide a positive amount.', color: 'Red' })] });
    let record = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record) record = new EconomyUser({ guildId: message.guild.id, userId: message.author.id, wallet: 0, bank: 0 });
    if (record.wallet < amount) return message.reply({ embeds: [createEmbed({ title: 'Insufficient funds', description: 'You do not have enough money in your wallet.', color: 'Red' })] });
    record.wallet -= amount;
    record.bank += amount;
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Deposit complete', description: `Deposited $${amount} to your bank.`, color: 'Green' })] });
  }
};
