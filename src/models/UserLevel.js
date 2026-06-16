const mongoose = require('mongoose');

const userLevelSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastMessageTimestamp: { type: Number, default: 0 },
  voiceTime: { type: Number, default: 0 }
});
userLevelSchema.index({ guildId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('UserLevel', userLevelSchema);
