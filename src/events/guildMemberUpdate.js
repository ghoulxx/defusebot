const GuildConfig = require('../models/GuildConfig');
const { createEmbed } = require('../utils/embed');
const { formatTemplate } = require('../utils/template');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(client, oldMember, newMember) {
    if (!oldMember.premiumSince && newMember.premiumSince) {
      const config = await GuildConfig.findOne({ guildId: newMember.guild.id });
      if (!config || !config.boostChannelId) return;
      const channel = await newMember.guild.channels.fetch(config.boostChannelId).catch(() => null);
      if (!channel) return;
      const description = formatTemplate(config.boostMessage, {
        user: { mention: `<@${newMember.id}>`, name: newMember.user.username },
        guild: { name: newMember.guild.name, membercount: newMember.guild.memberCount }
      });
      await channel.send({ embeds: [createEmbed({ title: 'Server Boost', description })] });
    }
  }
};
