const mongoose = require('mongoose');

const economyUserSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastWork: { type: Date, default: null },
  lastRob: { type: Date, default: null },
  lastDaily: { type: Date, default: null },
  inventory: { type: [String], default: [] }
});
economyUserSchema.index({ guildId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('EconomyUser', economyUserSchema);
