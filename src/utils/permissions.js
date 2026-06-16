function memberHasPermissions(member, permissions) {
  return member.permissions.has(permissions, true);
}

function botHasPermissions(channel, permissions) {
  return channel.guild.members.me.permissionsIn(channel).has(permissions, true);
}

function canActOn(target, actor) {
  if (!target.roles || !actor.roles) return false;
  return target.roles.highest.position < actor.roles.highest.position;
}

module.exports = { memberHasPermissions, botHasPermissions, canActOn };
