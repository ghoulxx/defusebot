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
  }
});

module.exports = mongoose.model('AntinukeConfig', antiNukeSchema);
