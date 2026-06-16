const { setPresence } = require('../utils/setPresence');
const cron = require('node-cron');
const Giveaway = require('../models/Giveaway');
const { createEmbed } = require('../utils/embed');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    setPresence(client);

    cron.schedule('* * * * *', async () => {
      const now = new Date();
      const ended = await Giveaway.find({ endsAt: { $lte: now } });
      for (const giveaway of ended) {
        try {
          const guild = await client.guilds.fetch(giveaway.guildId);
          const channel = await guild.channels.fetch(giveaway.channelId);
          const message = await channel.messages.fetch(giveaway.messageId);
          const entries = Array.from(new Set(giveaway.entries));
          if (entries.length === 0) {
            await channel.send({ embeds: [createEmbed({ title: 'Giveaway ended', description: `No valid entries for **${giveaway.prize}**.` })] });
          } else {
            const winners = [];
            while (winners.length < giveaway.winnerCount && entries.length > 0) {
              const index = Math.floor(Math.random() * entries.length);
              winners.push(entries.splice(index, 1)[0]);
            }
            await channel.send({ embeds: [createEmbed({ title: 'Giveaway winners', description: `Congratulations ${winners.map((id) => `<@${id}>`).join(', ')}! You won **${giveaway.prize}**.` })] });
          }
          await Giveaway.deleteOne({ _id: giveaway._id });
          await message.edit({ components: [] });
        } catch (error) {
          console.error('Error ending giveaway:', error);
        }
      }
    });
  }
};
