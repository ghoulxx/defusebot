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
      const guildCount = client.guilds.cache.size || 0;
      const memberCount = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0);
      const base = `${guildCount} Servers • ${memberCount.toLocaleString()} Users`;

      console.log(`Bot supports ${guildCount} servers and ${memberCount.toLocaleString()} users`);

      const status = options.status || (client?.user?.presence?.status) || (client?.presence?.status) || 'online';
      await client.user.setPresence({
        activities: [
          {
            name: base,
            type: ActivityType.Streaming,
            url: options.streamUrl || 'https://twitch.tv/'
          }
        ],
        status
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
