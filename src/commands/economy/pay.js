const EconomyUser = require('../../models/EconomyUser');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'pay',
  description: 'Pay another user from your wallet.',
  aliases: [],
  async execute(message, args) {
    const target = message.mentions.users.first();
    const amount = Number(args[1]);
    if (!target || !amount || amount <= 0) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!pay @user <amount>`.', color: 'Orange' })] });
    if (target.id === message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Invalid target', description: 'You cannot pay yourself.', color: 'Red' })] });
    let sender = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!sender || sender.wallet < amount) return message.reply({ embeds: [createEmbed({ title: 'Insufficient funds', description: 'You do not have enough money in your wallet.', color: 'Red' })] });
    let receiver = await EconomyUser.findOne({ guildId: message.guild.id, userId: target.id });
    if (!receiver) receiver = new EconomyUser({ guildId: message.guild.id, userId: target.id, wallet: 0, bank: 0 });
    sender.wallet -= amount;
    receiver.wallet += amount;
    await sender.save();
    await receiver.save();
    return message.reply({ embeds: [createEmbed({ title: 'Payment sent', description: `Paid $${amount} to ${target.tag}.`, color: 'Green' })] });
  }
};
