const GuildConfig = require('../../models/GuildConfig');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'welcome',
  description: 'Configure the welcome system.',
  aliases: [],
  async execute(message, args) {
    const field = args[0]?.toLowerCase();
    const value = args.slice(1).join(' ');
    if (!['channel', 'message', 'prefix'].includes(field) || !value) {
      return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!welcome channel <channel-id>`, `!welcome message <text>`, or `!welcome prefix <prefix>`.', color: 'Orange' })] });
    }
    const update = {};
    if (field === 'channel') update.welcomeChannelId = value.replace(/\D/g, '');
    if (field === 'message') update.welcomeMessage = value;
    if (field === 'prefix') update.prefix = value;
    await GuildConfig.findOneAndUpdate({ guildId: message.guild.id }, update, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Welcome settings saved', description: `Updated ${field}.`, color: 'Green' })] });
  }
};
