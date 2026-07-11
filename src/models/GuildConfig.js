const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '$' },
  levelingEnabled: { type: Boolean, default: true },
  logChannelId: { type: String, default: null },
  welcomeChannelId: { type: String, default: null },
  leaveChannelId: { type: String, default: null },
  boostChannelId: { type: String, default: null },
  welcomeMessage: { type: String, default: 'Welcome {user.mention} to {guild.name}!' },
  leaveMessage: { type: String, default: '{user.name} left {guild.name}.' },
  boostMessage: { type: String, default: 'Thank you {user.mention} for boosting {guild.name}!' }
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
