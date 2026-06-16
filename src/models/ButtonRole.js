const mongoose = require('mongoose');

const buttonRoleSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  messageId: { type: String, required: true },
  customId: { type: String, required: true },
  roleId: { type: String, required: true }
});
module.exports = mongoose.model('ButtonRole', buttonRoleSchema);
