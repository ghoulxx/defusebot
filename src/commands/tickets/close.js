const Ticket = require('../../models/Ticket');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'ticketclose',
  description: 'Close this ticket channel.',
  aliases: [],
  async execute(message) {
    const ticket = await Ticket.findOne({ channelId: message.channel.id, status: 'open' });
    if (!ticket) return message.reply({ embeds: [createEmbed({ title: 'No ticket', description: 'This channel is not an open ticket.', color: 'Red' })] });
    ticket.status = 'closed';
    await ticket.save();
    await message.reply({ embeds: [createEmbed({ title: 'Ticket closed', description: 'This ticket will delete in 5 seconds.', color: 'Green' })] });
    setTimeout(() => message.channel.delete().catch(() => null), 5000);
  }
};
