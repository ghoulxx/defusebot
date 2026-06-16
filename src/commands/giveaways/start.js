const Giveaway = require('../../models/Giveaway');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'giveaway',
  description: 'Start a giveaway in the current channel.',
  aliases: [],
  async execute(message, args) {
    const winners = Number(args[0]);
    const duration = Number(args[1]);
    const prize = args.slice(2).join(' ');
    if (!winners || !duration || !prize) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!giveaway <winners> <minutes> <prize>`.', color: 'Orange' })] });
    const endsAt = new Date(Date.now() + duration * 60 * 1000);
    const embed = createEmbed({ title: 'Giveaway started!', description: `Prize: **${prize}**
Winners: **${winners}**
Ends: <t:${Math.floor(endsAt.getTime() / 1000)}:R>` });
    const button = { type: 2, style: 3, label: 'Enter Giveaway', custom_id: `giveaway_enter_${message.id}` };
    const sent = await message.channel.send({ embeds: [embed], components: [{ type: 1, components: [button] }] });
    await Giveaway.create({ guildId: message.guild.id, channelId: message.channel.id, messageId: sent.id, prize, winnerCount: winners, endsAt, entries: [] });
    return message.reply({ embeds: [createEmbed({ title: 'Giveaway created', description: `Giveaway posted in ${message.channel}.`, color: 'Green' })] });
  }
};
