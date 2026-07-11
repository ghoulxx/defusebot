const { ActivityType } = require('discord.js');

function formatCounts(client) {
  try {
    // For streamer mode, return a simple label instead of dynamic counts
    return 'Streamer Mode';
  } catch (err) {
    return 'VR Mode';
  }
}

function setPresence(client, options = {}) {
  if (!client || !client.user) return;
  const refreshMs = options.refreshMs ?? 5 * 60 * 1000; // default 5 minutes

  async function apply() {
    try {
      const base = formatCounts(client);
      const status = (client?.user?.presence?.status) || (client?.presence?.status) || 'dnd';
      const statusEmoji = {
        online: '🟢',
        dnd: '🔴',
        idle: '🟠',
        offline: '⚫',
        invisible: '⚫'
      }[status] || '';
      const name = `${statusEmoji} ${base}`;
      await client.user.setPresence({
        activities: [
          {
            name,
            type: ActivityType.Playing
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
