const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'support',
  description: 'Show support information for the bot.',
  async execute(message) {
    return message.reply({
      embeds: [
        createEmbed({
          title: '🛠️ Support',
          description: 'Support is available through the bot owner or your server administrator. Use the help command to discover available features.'
        })
      ]
    });
  }
};
