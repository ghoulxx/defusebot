const TempVoiceChannel = require('../../models/TempVoiceChannel');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicepermit',
  description: 'Permit a user to join your locked voice channel.',
  aliases: [],
  async execute(message, args) {
    const target = message.mentions.members.first();
    if (!target) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!voicepermit @user`.', color: 'Orange' })] });
    const channel = message.member.voice.channel;
    if (!channel) return message.reply({ embeds: [createEmbed({ title: 'Not in voice', description: 'Join your temporary voice channel to permit someone.', color: 'Red' })] });
    const temp = await TempVoiceChannel.findOne({ channelId: channel.id });
    if (!temp || temp.ownerId !== message.author.id) return message.reply({ embeds: [createEmbed({ title: 'Not owner', description: 'You do not own this channel.', color: 'Red' })] });
    temp.permittedUsers = Array.from(new Set([...(temp.permittedUsers || []), target.id]));
    await temp.save();
    await channel.permissionOverwrites.edit(target.id, { Connect: true, ViewChannel: true });
    return message.reply({ embeds: [createEmbed({ title: 'Access granted', description: `${target.user.tag} can now join your voice channel.`, color: 'Green' })] });
  }
};
