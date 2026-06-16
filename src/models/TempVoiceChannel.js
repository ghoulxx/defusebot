const mongoose = require('mongoose');

const tempVoiceSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  locked: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  permittedUsers: { type: [String], default: [] },
  limit: { type: Number, default: 0 }
});
module.exports = mongoose.model('TempVoiceChannel', tempVoiceSchema);
