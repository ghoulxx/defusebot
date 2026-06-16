const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voiceclaim',
  description: 'Claim ownership of a temporary channel.',
  aliases: [],
  async execute(message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join a temporary voice channel to claim it.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp) return message.reply({ embeds: [createEmbed({ title: 'Not temporary', description: 'This channel is not managed by the bot.', color: 'Red' })] });
    if (temp.ownerId === message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Already owner', description: 'You already own this channel.', color: 'Orange' })] });
    const ownerStillInChannel = channel.members.has(temp.ownerId);
    if (ownerStillInChannel) return message.reply({ embeds: [createEmbed({ title: 'Cannot claim', description: 'The current owner is still in the voice channel.', color: 'Red' })] });
    temp.ownerId = message.author.id;
    await temp.save();
    return message.reply({ embeds: [createEmbed({ title: 'Voice claimed', description: 'You are now the owner of this temporary voice channel.', color: 'Green' })] });
  }
};
