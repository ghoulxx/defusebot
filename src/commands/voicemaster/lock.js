const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicelock',
  description: 'Lock your temporary voice channel.',
  aliases: [],
  async execute(message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join a temporary voice channel to lock it.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this voice channel.', color: 'Red' })] });
    temp.locked = true;
    await temp.save();
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: false });
    return message.reply({ embeds: [createEmbed({ title: 'Voice locked', description: 'Your voice channel is now locked.', color: 'Green' })] });
  }
};
