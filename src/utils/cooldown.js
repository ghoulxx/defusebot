const cooldowns = new Map();

function checkCooldown(key, duration) {
  const now = Date.now();
  const expiration = cooldowns.get(key);
  if (expiration && now < expiration) {
    return Math.ceil((expiration - now) / 1000);
  }
  cooldowns.set(key, now + duration * 1000);
  return 0;
}

module.exports = { checkCooldown };
