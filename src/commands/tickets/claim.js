const Ticket = require('../../models/Ticket');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'ticketclaim',
  description: 'Claim a support ticket channel.',
  aliases: [],
  async execute(message) {
    const ticket = await Ticket.findOne({ channelId: message.channel.id, status: 'open' });
    if (!ticket) return message.reply({ embeds: [createEmbed({ title: 'No ticket', description: 'This channel is not a ticket or it is already closed.', color: 'Red' })] });
    ticket.claimedBy = message.author.id;
    await ticket.save();
    return message.reply({ embeds: [createEmbed({ title: 'Ticket claimed', description: `This ticket has been claimed by ${message.author.tag}.`, color: 'Green' })] });
  }
};
