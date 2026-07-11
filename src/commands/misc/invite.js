const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'invite',
  description: 'Generate an invite link for the bot.',
  async execute(message) {
    try {
      const link = await message.client.generateInvite({
        scopes: ['bot'],
        permissions: ['SendMessages', 'ReadMessageHistory', 'ViewChannel', 'EmbedLinks', 'AttachFiles', 'UseExternalEmojis']
      });

      return message.reply({
        embeds: [createEmbed({ title: '🔗 Invite Link', description: `[Click here to invite the bot](${link})` })]
      });
    } catch (error) {
      return message.reply({ embeds: [createEmbed({ title: 'Invite Link', description: 'Unable to generate an invite link right now.' })] });
    }
  }
};
