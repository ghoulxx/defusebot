const { AuditLogEvent } = require('discord.js');
const AntinukeConfig = require('../models/AntinukeConfig');
const { antiNukeState, shouldTriggerAntiNuke } = require('../utils/antinukeGuard');

async function executePunishment(guild, executor, punishment, reason) {
  if (!executor || executor.id === guild.ownerId || executor.bot) return;
  const member = await guild.members.fetch(executor.id).catch(() => null);
  if (!member) return;
  try {
    if (punishment === 'ban') {
      await member.ban({ reason });
    } else {
      await member.kick(reason);
    }
  } catch (error) {
    console.error('Anti-nuke punishment failed:', error);
  }
}

async function getExecutorFromAudit(guild, actionType) {
  const logs = await guild.fetchAuditLogs({ type: actionType, limit: 1 }).catch(() => null);
  return logs?.entries?.first()?.executor || null;
}

module.exports = {
  name: 'channelDelete',
  async execute(client, channel) {
    if (!channel.guild) return;
    const config = await AntinukeConfig.findOne({ guildId: channel.guild.id });
    if (!config || !config.enabled) return;

    if (!shouldTriggerAntiNuke(channel.guild.id, 'channelDelete', antiNukeState)) return;

    const executor = await getExecutorFromAudit(channel.guild, AuditLogEvent.ChannelDelete);
    const punishment = config.punishments?.massChannelDelete || 'kick';
    await executePunishment(channel.guild, executor, punishment, 'Anti-nuke triggered: rapid channel deletion');
  }
};
