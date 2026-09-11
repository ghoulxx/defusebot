const { createEmbed } = require('../../utils/embed');

// Music playback is currently disabled due to provider rate limiting issues with play-dl
module.exports = {
  name: 'play',
  description: 'Play a song or add it to the queue.',
  async execute(message, args) {
    return message.reply({
      embeds: [
        createEmbed({
          title: 'Music',
          description: 'Music playback is currently unavailable due to provider limitations. We are working on an alternative solution.',
          color: 'Orange'
        })
      ]
    });
  }
};

