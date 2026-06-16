const GuildConfig = require('../models/GuildConfig');
const { createEmbed } = require('../utils/embed');
const { formatTemplate } = require('../utils/template');

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    const config = await GuildConfig.findOne({ guildId: member.guild.id });
    if (!config || !config.welcomeChannelId) return;
    const channel = await member.guild.channels.fetch(config.welcomeChannelId).catch(() => null);
    if (!channel) return;
    const description = formatTemplate(config.welcomeMessage, {
      user: { mention: `<@${member.id}>`, name: member.user.username },
      guild: { name: member.guild.name, membercount: member.guild.memberCount }
    });
    await channel.send({ embeds: [createEmbed({ title: 'Welcome!', description })] });
  }
};
