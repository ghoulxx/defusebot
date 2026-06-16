const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicetransfer',
  description: 'Transfer ownership of your temporary voice channel.',
  aliases: [],
  async execute(message, args) {
    const target = message.mentions.members.first();
    if (!target) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!voicetransfer @user`.', color: 'Orange' })] });
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join your temporary voice channel to transfer it.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this voice channel.', color: 'Red' })] });
    temp.ownerId = target.id;
    await temp.save();
    return message.reply({ embeds: [createEmbed({ title: 'Ownership transferred', description: `Ownership moved to ${target.user.tag}.`, color: 'Green' })] });
  }
};
