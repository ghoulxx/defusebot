const GuildConfig = require('../models/GuildConfig');
const { createEmbed } = require('../utils/embed');
const { formatTemplate } = require('../utils/template');

module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    const config = await GuildConfig.findOne({ guildId: member.guild.id });
    if (!config || !config.leaveChannelId) return;
    const channel = await member.guild.channels.fetch(config.leaveChannelId).catch(() => null);
    if (!channel) return;
    const description = formatTemplate(config.leaveMessage, {
      user: { mention: `<@${member.id}>`, name: member.user.username },
      guild: { name: member.guild.name, membercount: member.guild.memberCount }
    });
    await channel.send({ embeds: [createEmbed({ title: 'Goodbye', description })] });
  }
};
