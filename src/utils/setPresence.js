const { ActivityType } = require('discord.js');

function setPresence(client) {
  if (!client.user) return;
  client.user.setPresence({
    activities: [
      {
        name: '/functionaladdicts',
        type: ActivityType.Streaming,
        url: 'https://twitch.tv/functionaladdicts'
      }
    ],
    status: 'online'
  }).catch(() => null);
}

module.exports = { setPresence };
