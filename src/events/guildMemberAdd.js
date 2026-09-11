const { AuditLogEvent } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');
const AntinukeConfig = require('../models/AntinukeConfig');
const { createEmbed } = require('../utils/embed');
const { formatTemplate } = require('../utils/template');
const { antiNukeState, shouldTriggerAntiNuke, isTrustedTarget } = require('../utils/antinukeGuard');

async function punishMember(guild, executor, punishment, reason) {
  if (!executor || executor.id === guild.ownerId || executor.bot) return;
  const member = await guild.members.fetch(executor.id).catch(() => null);
  if (!member) return;
  try {
    if (punishment === 'ban') {
      await member.ban({ reason });
    } else {
      await member.kick(reason);
    }
  } catch (error) {
    console.error('Anti-nuke punishment failed:', error);
  }
}

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    const antinuke = await AntinukeConfig.findOne({ guildId: member.guild.id });
    
    // Antibot: kick any bot if antibot is enabled
    if (antinuke?.antibot && member.user.bot) {
      const logs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 }).catch(() => null);
      const executor = logs?.entries?.first()?.executor || null;
      if (executor && executor.id !== member.guild.ownerId) {
        await punishMember(member.guild, executor, 'kick', 'Antibot triggered: unauthorized bot added');
      }
      return;
    }

    // Original anti-nuke rapid bot detection
    if (antinuke?.enabled && member.user.bot && shouldTriggerAntiNuke(member.guild.id, 'botAdd', antiNukeState)) {
      const logs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 }).catch(() => null);
      const executor = logs?.entries?.first()?.executor || null;
      if (!executor || isTrustedTarget(antinuke, executor)) return;
      const punishment = antinuke.punishments?.botAdd || 'ban';
      await punishMember(member.guild, executor, punishment, 'Anti-nuke triggered: rapid bot joins');
      return;
    }

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
