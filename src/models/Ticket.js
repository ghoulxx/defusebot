const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  openerId: { type: String, required: true },
  claimedBy: { type: String, default: null },
  status: { type: String, default: 'open' },
  transcript: { type: [String], default: [] }
});
module.exports = mongoose.model('Ticket', ticketSchema);
