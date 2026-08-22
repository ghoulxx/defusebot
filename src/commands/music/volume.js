const { createEmbed } = require('../../utils/embed');
const { getQueue, setVolume } = require('./musicState');

module.exports = {
  name: 'volume',
  description: 'Adjust the playback volume.',
  async execute(message, args) {
    const value = Number(args[0]);
    const queue = getQueue(message.guild.id);

    if (!Number.isFinite(value)) {
      return message.reply({ embeds: [createEmbed({ title: 'Music Volume', description: `Current volume: ${queue.volume}%` })] });
    }

    setVolume(message.guild.id, value);
    if (queue.player && queue.player.state && queue.player.state.resource && queue.player.state.resource.volume) {
      queue.player.state.resource.volume.setVolume(Math.max(0, Math.min(1, value / 100)));
    }
    return message.reply({ embeds: [createEmbed({ title: 'Music Volume', description: `Volume set to ${queue.volume}%` })] });
  }
};
