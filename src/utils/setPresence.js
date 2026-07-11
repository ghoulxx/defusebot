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

      // allow caller to override status; default to online so bot isn't DND
      const status = options.status || (client?.user?.presence?.status) || (client?.presence?.status) || 'online';
      const base = formatCounts(client);
      // set presence to streaming-style with counts as the activity name
      const name = base;
      await client.user.setPresence({
        activities: [
          {
            name,
            type: ActivityType.Streaming,
            url: options.streamUrl || 'https://twitch.tv/'
          }
        ],
        status: options.status || 'online'
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
