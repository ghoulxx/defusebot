const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voiceunlock',
  description: 'Unlock your temporary voice channel.',
  aliases: [],
  async execute(message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join a temporary voice channel to unlock it.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this voice channel.', color: 'Red' })] });
    temp.locked = false;
    await temp.save();
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { Connect: true });
    return message.reply({ embeds: [createEmbed({ title: 'Voice unlocked', description: 'Your voice channel is now unlocked.', color: 'Green' })] });
  }
};
