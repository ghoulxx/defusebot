const EconomyUser = require('../../models/EconomyUser');
const { checkCooldown } = require('../../utils/cooldown');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'work',
  description: 'Work and earn money.',
  aliases: [],
  async execute(message) {
    const cooldownKey = `${message.guild.id}-${message.author.id}-work`;
    const remaining = checkCooldown(cooldownKey, 3600);
    if (remaining) {
      return message.reply({ embeds: [createEmbed({ title: 'Cooldown', description: `You must wait ${remaining}s before working again.`, color: 'Orange' })] });
    }
    const amount = Math.floor(Math.random() * 150) + 50;
    let record = await EconomyUser.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record) {
      record = new EconomyUser({ guildId: message.guild.id, userId: message.author.id, wallet: 0, bank: 0 });
    }
    record.wallet += amount;
    record.lastWork = new Date();
    await record.save();
    return message.reply({ embeds: [createEmbed({ title: 'Work completed', description: `You earned $${amount}.`, color: 'Green' })] });
  }
};
