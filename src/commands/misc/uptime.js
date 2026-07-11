const { createEmbed } = require('../../utils/embed');

function formatDuration(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins) parts.push(`${mins}m`);
  if (secs || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

module.exports = {
  name: 'uptime',
  description: 'Show how long the bot has been online.',
  async execute(message) {
    return message.reply({
      embeds: [
        createEmbed({
          title: '⏱️ Uptime',
          description: `The bot has been online for ${formatDuration(Math.floor(process.uptime()))}.`
        })
      ]
    });
  }
};
