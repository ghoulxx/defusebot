const { ActivityType } = require('discord.js');

function formatCounts(client) {
  try {
    const guildCount = client.guilds.cache.size || 0;
    const memberCount = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
    return `${guildCount} Servers • ${memberCount.toLocaleString()} Users`;
  } catch (err) {
    return 'VR Mode';
  }
}

function setPresence(client, options = {}) {
  if (!client || !client.user) return;
  const refreshMs = options.refreshMs ?? 5 * 60 * 1000; // default 5 minutes

  async function apply() {
    try {
      // compute numeric counts for logging
      const guildCount = client.guilds.cache.size || 0;
      const memberCount = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
      // show counts in console
      console.log(`Bot supports ${guildCount} servers and ${memberCount.toLocaleString()} users`);

      const status = (client?.user?.presence?.status) || (client?.presence?.status) || 'dnd';
      const statusEmoji = {
        online: '🟢',
        dnd: '🔴',
        idle: '🟠',
        offline: '⚫',
        invisible: '⚫'
      }[status] || '';

      // set presence to VR Mode (with status emoji prefix)
      const name = `${statusEmoji} VR Mode`;
      await client.user.setPresence({
        activities: [
          {
            name,
            type: ActivityType.Custom
          }
        ],
        status: 'dnd'
      });
    } catch (error) {
      console.error('Failed to set presence:', error);
    }
  }

  // apply immediately
  apply();

  // refresh periodically while the client is running
  const id = setInterval(() => {
    if (!client || !client.user) return clearInterval(id);
    apply();
  }, refreshMs);

  return id; // return interval id in case caller wants to clear it
}

module.exports = { setPresence };
