const Giveaway = require('../../models/Giveaway');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'giveaway',
  description: 'Start or end a giveaway.',
  aliases: ['ga'],
  async execute(message, args) {
    const subcommand = args[0]?.toLowerCase();

    if (subcommand === 'end') {
      const messageId = args[1];
      if (!messageId) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$giveaway end <message-id>`.', color: 'Orange' })] });
      const giveaway = await Giveaway.findOne({ messageId });
      if (!giveaway) return message.reply({ embeds: [createEmbed({ title: 'Giveaway not found', description: 'No giveaway found with that message ID.', color: 'Red' })] });
      giveaway.endsAt = new Date();
      await giveaway.save();
      return message.reply({ embeds: [createEmbed({ title: 'Giveaway ending', description: 'The giveaway will complete shortly.', color: 'Green' })] });
    }

    // Start giveaway (default)
    const winners = Number(args[0]);
    const duration = Number(args[1]);
    const prize = args.slice(2).join(' ');
    if (!winners || !duration || !prize) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `$giveaway <winners> <minutes> <prize>` to start, or `$giveaway end <message-id>` to end.', color: 'Orange' })] });
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
