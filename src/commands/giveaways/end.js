const Giveaway = require('../../models/Giveaway');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'giveawayend',
  description: 'End an active giveaway early.',
  aliases: [],
  async execute(message, args) {
    const messageId = args[0];
    if (!messageId) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!giveawayend <message-id>`.', color: 'Orange' })] });
    const giveaway = await Giveaway.findOne({ messageId });
    if (!giveaway) return message.reply({ embeds: [createEmbed({ title: 'Giveaway not found', description: 'No giveaway found with that message ID.', color: 'Red' })] });
    giveaway.endsAt = new Date();
    await giveaway.save();
    return message.reply({ embeds: [createEmbed({ title: 'Giveaway ending', description: 'The giveaway will complete shortly.', color: 'Green' })] });
  }
};
