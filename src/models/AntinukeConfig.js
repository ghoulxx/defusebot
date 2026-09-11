const mongoose = require('mongoose');

const antiNukeSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: false },
  whitelistUserIds: { type: [String], default: [] },
  whitelistRoleIds: { type: [String], default: [] },
  punishments: {
    massRoleCreate: { type: String, default: 'kick' },
    massRoleDelete: { type: String, default: 'kick' },
    massChannelCreate: { type: String, default: 'kick' },
    massChannelDelete: { type: String, default: 'kick' },
    botAdd: { type: String, default: 'ban' }
  },
  antibot: { type: Boolean, default: false },
  antilink: { type: Boolean, default: false },
  antimention: { type: Boolean, default: false },
  antiemojispam: { type: Boolean, default: false },
  antilinkThreshold: { type: Number, default: 5 },
  antimentionThreshold: { type: Number, default: 5 },
  antiemojispamThreshold: { type: Number, default: 10 }
});

module.exports = mongoose.model('AntinukeConfig', antiNukeSchema);
