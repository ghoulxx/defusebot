const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicelimit',
  description: 'Set the user limit on your temporary voice channel.',
  aliases: [],
  async execute(message, args) {
    const channel = message.member.voice.channel;
    const limit = Number(args[0]);
    if (!channel || limit < 0 || limit > 99 || isNaN(limit)) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!voicelimit <0-99>`. Zero removes the limit.', color: 'Orange' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this voice channel.', color: 'Red' })] });
    temp.limit = limit;
    await temp.save();
    await channel.edit({ userLimit: limit }).catch(() => null);
    return message.reply({ embeds: [createEmbed({ title: 'Limit updated', description: `Your voice channel limit is now ${limit}.`, color: 'Green' })] });
  }
};
