const ButtonRole = require('../../models/ButtonRole');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'buttonrole',
  description: 'Bind a button custom ID to a role.',
  aliases: [],
  async execute(message, args) {
    const customId = args[0];
    const role = message.mentions.roles.first();
    const messageId = args[2];
    if (!customId || !role || !messageId) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!buttonrole <custom-id> @role <message-id>`.', color: 'Orange' })] });
    await ButtonRole.create({ guildId: message.guild.id, messageId, customId, roleId: role.id });
    return message.reply({ embeds: [createEmbed({ title: 'Button role saved', description: `Button with ID ${customId} will toggle ${role}.`, color: 'Green' })] });
  }
};
