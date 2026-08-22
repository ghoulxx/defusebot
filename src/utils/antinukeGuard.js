const antiNukeState = new Map();

const ACTION_THRESHOLDS = {
  roleCreate: 3,
  roleDelete: 3,
  channelCreate: 3,
  channelDelete: 3,
  botAdd: 2,
  webhook: 2
};

function shouldTriggerAntiNuke(guildId, action, state = antiNukeState, now = Date.now()) {
  if (!guildId || !action) return false;
  const key = `${guildId}:${action}`;
  const history = state.get(key) || [];
  const windowMs = 15 * 1000;
  const recent = history.filter((timestamp) => now - timestamp <= windowMs);
  recent.push(now);
  state.set(key, recent);
  const threshold = ACTION_THRESHOLDS[action] || 3;
  return recent.length >= threshold;
}

function isTrustedTarget(config = {}, member = null) {
  if (!member) return false;
  const userId = member.id;
  const whitelistUserIds = Array.isArray(config.whitelistUserIds) ? config.whitelistUserIds : [];
  if (whitelistUserIds.includes(userId)) return true;

  const whitelistRoleIds = Array.isArray(config.whitelistRoleIds) ? config.whitelistRoleIds : [];
  if (!member.roles || !member.roles.cache) return false;

  const roleIds = Array.from(member.roles.cache.values()).map((role) => role.id);
  return roleIds.some((roleId) => whitelistRoleIds.includes(roleId));
}

module.exports = {
  antiNukeState,
  shouldTriggerAntiNuke,
  ACTION_THRESHOLDS,
  isTrustedTarget
};
