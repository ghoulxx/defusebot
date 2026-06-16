const EconomyUser = require('../../models/EconomyUser');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'balance',
  description: 'Check your wallet and bank balance.',
  aliases: ['bal'],
  async execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const record = await EconomyUser.findOne({ guildId: message.guild.id, userId: user.id }) || { wallet: 0, bank: 0 };
    return message.reply({ embeds: [createEmbed({ title: `${user.username}'s Balance`, fields: [{ name: 'Wallet', value: `$${record.wallet}`, inline: true }, { name: 'Bank', value: `$${record.bank}`, inline: true }] })] });
  }
};
