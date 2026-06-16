const EconomyUser = require('../../models/EconomyUser');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'setbalance',
  description: 'Set a user wallet or bank balance.',
  aliases: [],
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) return message.reply({ embeds: [createEmbed({ title: 'Permission denied', description: 'Administrator permission required.', color: 'Red' })] });
    const target = message.mentions.users.first();
    const location = args[1]?.toLowerCase();
    const amount = Number(args[2]);
    if (!target || !['wallet', 'bank'].includes(location) || isNaN(amount)) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!setbalance @user wallet|bank <amount>`.', color: 'Orange' })] });
    let record = await EconomyUser.findOne({ guildId: message.guild.id, userId: target.id });
    if (!record) record = new EconomyUser({ guildId: message.guild.id, userId: target.id, wallet: 0, bank: 0 });
    record[location] = amount;
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Balance updated', description: `${target.tag}'s ${location} is now $${amount}.`, color: 'Green' })] });
  }
};
