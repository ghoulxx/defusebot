const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: true, unique: true },
  prize: { type: String, required: true },
  winnerCount: { type: Number, default: 1 },
  endsAt: { type: Date, required: true },
  requirements: { type: Object, default: {} },
  entries: { type: [String], default: [] }
});
module.exports = mongoose.model('Giveaway', giveawaySchema);
