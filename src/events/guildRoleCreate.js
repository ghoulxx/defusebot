const { AuditLogEvent } = require('discord.js');
const AntinukeConfig = require('../models/AntinukeConfig');
const { antiNukeState, shouldTriggerAntiNuke, isTrustedTarget } = require('../utils/antinukeGuard');

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
  name: 'roleCreate',
  async execute(client, role) {
    const config = await AntinukeConfig.findOne({ guildId: role.guild.id });
    if (!config || !config.enabled) return;

    if (!shouldTriggerAntiNuke(role.guild.id, 'roleCreate', antiNukeState)) return;

    const executor = await getExecutorFromAudit(role.guild, AuditLogEvent.RoleCreate);
    if (!executor || isTrustedTarget(config, executor)) return;

    const punishment = config.punishments?.massRoleCreate || 'kick';
    await executePunishment(role.guild, executor, punishment, 'Anti-nuke triggered: rapid role creation');
  }
};
