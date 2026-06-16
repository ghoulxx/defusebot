const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicehide',
  description: 'Hide your temporary voice channel.',
  aliases: [],
  async execute(message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join a temporary voice channel to hide it.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this voice channel.', color: 'Red' })] });
    temp.hidden = true;
    await temp.save();
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: false });
    return message.reply({ embeds: [createEmbed({ title: 'Voice hidden', description: 'Your voice channel is now hidden from everyone.', color: 'Green' })] });
  }
};
