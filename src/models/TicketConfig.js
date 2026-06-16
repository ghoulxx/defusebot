const mongoose = require('mongoose');

const ticketConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true },
  supportRoleIds: { type: [String], default: [] },
  panelChannelId: { type: String, required: true },
  panelMessageId: { type: String, required: true },
  panelEmbed: { type: Object, default: {} }
});
module.exports = mongoose.model('TicketConfig', ticketConfigSchema);
