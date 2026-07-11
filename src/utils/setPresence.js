const { ActivityType } = require('discord.js');

function setPresence(client) {
  if (!client.user) return;
  try {
    client.user.setPresence({
      activities: [
        {
          name: 'VR Mode',
          type: ActivityType.Playing
        }
      ],
      status: 'dnd'
    });
  } catch (error) {
    console.error('Failed to set presence:', error);
  }
}

module.exports = { setPresence };
