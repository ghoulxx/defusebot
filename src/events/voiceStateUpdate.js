const VoiceMasterConfig = require('../models/VoiceMasterConfig');
const TempVoiceChannel = require('../models/TempVoiceChannel');
const { createEmbed } = require('../utils/embed');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {
    const guild = newState.guild || oldState.guild;
    const config = await VoiceMasterConfig.findOne({ guildId: guild.id });
    if (!config) return;
    const joinChannelId = config.joinToCreateChannelId;
    if (newState.channelId === joinChannelId && !newState.member.user.bot) {
      const category = await guild.channels.fetch(config.categoryId).catch(() => null);
      if (!category) return;
      const tempChannel = await guild.channels.create({
        name: `${newState.member.user.username}'s room`.slice(0, 95),
        type: 2,
        parent: category,
        permissionOverwrites: [
          { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
          { id: newState.member.id, allow: ['Connect', 'Speak', 'ViewChannel', 'MoveMembers'] }
        ]
      });
      await TempVoiceChannel.create({ guildId: guild.id, channelId: tempChannel.id, ownerId: newState.member.id });
      await newState.setChannel(tempChannel).catch(() => null);
      const controlEmbed = createEmbed({ title: 'Voice room created', description: `You now own ${tempChannel}. Use /voicelock, /voiceunlock, /voice hide, /voice reveal, /voice limit, /voice rename, /voice claim, or /voice transfer.` });
      await newState.member.send({ embeds: [controlEmbed] }).catch(() => null);
      return;
    }

    if (oldState.channelId && oldState.channelId !== joinChannelId) {
      const temp = await TempVoiceChannel.findOne({ channelId: oldState.channelId });
      if (!temp) return;
      const channel = await guild.channels.fetch(oldState.channelId).catch(() => null);
      if (!channel) {
        await TempVoiceChannel.deleteOne({ channelId: oldState.channelId });
        return;
      }
      if (channel.members.size === 0) {
        await channel.delete().catch(() => null);
        await TempVoiceChannel.deleteOne({ channelId: oldState.channelId });
      }
    }
  }
};
