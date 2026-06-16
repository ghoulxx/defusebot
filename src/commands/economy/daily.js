const EconomyUser = require('../../models/EconomyUser');
const { checkCooldown } = require('../../utils/cooldown');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'daily',
  description: 'Claim your daily reward.',
  aliases: [],
  async execute(message) {
    const cooldownKey = `${message.guild.id}-${message.author.id}-daily`;
    const remaining = checkCooldown(cooldownKey, 86400);
    if (remaining) {
      return message.reply({ embeds: [createEmbed({ title: 'Cooldown', description: `You must wait ${remaining}s before claiming daily again.`, color: 'Orange' })] });
    }
    let record = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record) record = new EconomyUser({ guildId: message.guild.id, userId: message.author.id, wallet: 0, bank: 0 });
    const amount = 500;
    record.wallet += amount;
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Daily claimed', description: `You received $${amount}.`, color: 'Green' })] });
  }
};
