const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicename',
  description: 'Rename your temporary voice channel.',
  aliases: ['voicerenamed', 'voicename'],
  async execute(message, args) {
    const newName = args.join(' ');
    if (!newName) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!voicename <name>`.', color: 'Orange' })] });
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join a temporary voice channel to rename it.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this voice channel.', color: 'Red' })] });
    await channel.edit({ name: newName.slice(0, 100) }).catch(() => null);
    return message.reply({ embeds: [createEmbed({ title: 'Voice renamed', description: `Your voice channel is now called ${newName}.`, color: 'Green' })] });
  }
};
