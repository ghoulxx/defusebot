const VoiceMasterConfig = require('../../models/VoiceMasterConfig');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'voicemaster',
  description: 'Setup Join-to-Create voice channels for the server.',
  aliases: [],
  async execute(message, args) {
    const mentionCreate = message.mentions.channels.filter((c) => c.type === 2).first();
    const mentionCategory = message.mentions.channels.filter((c) => c.type === 4).first();
    const mentionText = message.mentions.channels.filter((c) => c.type === 0).first();
    if (!mentionCreate || !mentionCategory || !mentionText) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!voicemaster <voice-channel> <category> <text-channel>`.', color: 'Orange' })] });
    await VoiceMasterConfig.findOneAndUpdate(
      { guildId: message.guild.id },
      { joinToCreateChannelId: mentionCreate.id, categoryId: mentionCategory.id, interfaceChannelId: mentionText.id },
      { upsert: true }
    );
    return message.reply({ embeds: [createEmbed({ title: 'VoiceMaster configured', description: `Join-to-Create: ${mentionCreate}
Temp category: ${mentionCategory}
Interface: ${mentionText}`, color: 'Green' })] });
  }
};
