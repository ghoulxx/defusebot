const { ActivityType } = require('discord.js');

function setPresence(client) {
  if (!client.user) return;
  try {
    client.user.setPresence({
      activities: [
        {
          name: '/functionaladdicts',
          type: ActivityType.Streaming,
          url: 'https://twitch.tv/functionaladdicts'
        }
      ],
      status: 'online'
    });
  } catch (error) {
    console.error('Failed to set presence:', error);
  }
}

module.exports = { setPresence };
