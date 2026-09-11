const { AuditLogEvent } = require('discord.js');
const UserLevel = require('../models/UserLevel');
const GuildConfig = require('../models/GuildConfig');
const AntinukeConfig = require('../models/AntinukeConfig');
const { createEmbed } = require('../utils/embed');
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
  name: 'messageCreate',
  async execute(client, message) {
    if (!message.guild) return;

    const antinuke = await AntinukeConfig.findOne({ guildId: message.guild.id });
    if (antinuke?.enabled && message.webhookId && shouldTriggerAntiNuke(message.guild.id, 'webhook', antiNukeState)) {
      const logs = await message.guild.fetchAuditLogs({ type: AuditLogEvent.WebhookCreate, limit: 1 }).catch(() => null);
      const executor = logs?.entries?.first()?.executor || null;
      if (!executor || isTrustedTarget(antinuke, executor)) return;
      const punishment = antinuke.punishments?.massChannelCreate || 'kick';
      await punishMember(message.guild, executor, punishment, 'Anti-nuke triggered: webhook spam');
      return;
    }

    if (message.author.bot) return;

    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id });
    const prefix = '$';
    const content = message.content.trim();

    // Antilink check
    if (antinuke?.antilink) {
      const linkCount = (content.match(/(discord\.gg\/|discordapp\.com\/invite\/)/g) || []).length;
      if (linkCount >= (antinuke.antilinkThreshold || 5)) {
        await punishMember(message.guild, message.author, 'kick', `Antilink triggered: ${linkCount} Discord invite links`);
        return;
      }
    }

    // Antimention check
    if (antinuke?.antimention) {
      const mentionCount = message.mentions.size;
      if (mentionCount >= (antinuke.antimentionThreshold || 5)) {
        await punishMember(message.guild, message.author, 'kick', `Antimention triggered: ${mentionCount} mentions`);
        return;
      }
    }

    // Antiemojispam check
    if (antinuke?.antiemojispam) {
      const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27B0}]|<a?:[\w]+:\d+>/gu;
      const emojiCount = (content.match(emojiRegex) || []).length;
      if (emojiCount >= (antinuke.antiemojispamThreshold || 10)) {
        await punishMember(message.guild, message.author, 'kick', `Antiemojispam triggered: ${emojiCount} emojis`);
        return;
      }
    }

    if (content.startsWith(prefix)) {
      const args = content.slice(prefix.length).trim().split(/\s+/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);
      if (command) {
        try {
          await command.execute(message, args);
        } catch (error) {
          console.error(error);
          await message.reply({ embeds: [createEmbed({ title: 'Command Error', description: 'Something went wrong while running that command.', color: 'Red' })] });
        }
        return;
      }
    }
    // Message logging (if enabled)
    if (guildConfig?.messageLoggingEnabled) {
      try {
        const logId = guildConfig.messageLogChannelId;
        if (logId && message.channel.id !== logId) {
          const logChannel = message.guild.channels.cache.get(logId) || await message.guild.channels.fetch(logId).catch(() => null);
          if (logChannel) {
            const fields = [
              { name: 'Author', value: `${message.author.tag} (${message.author.id})`, inline: true },
              { name: 'Channel', value: `<#${message.channel.id}>`, inline: true }
            ];
            if (message.content) fields.push({ name: 'Content', value: message.content.substring(0, 1024) });
            if (message.attachments && message.attachments.size) fields.push({ name: 'Attachments', value: message.attachments.map(a => a.url).join('\n') });
            await logChannel.send({ embeds: [createEmbed({ title: 'Message Sent', fields, timestamp: new Date() })] }).catch(() => null);
          }
        }
      } catch (err) {
        console.error('Message logging failed', err);
      }
    }

    const now = Date.now();
    // Respect per-guild leveling toggle
    if (guildConfig && guildConfig.levelingEnabled === false) return;
    let record = await UserLevel.findOne({ guildId: message.guild.id, userId: message.author.id });
    if (!record) {
      record = new UserLevel({ guildId: message.guild.id, userId: message.author.id });
    }

    if (now - record.lastMessageTimestamp < 60 * 1000) return;
    const gainedXp = Math.floor(Math.random() * 15) + 15;
    record.xp += gainedXp;
    record.lastMessageTimestamp = now;
    const nextLevelXp = record.level * 100 + 100;

    if (record.xp >= nextLevelXp) {
      record.level += 1;
      await message.channel.send({ embeds: [createEmbed({ title: 'Level Up!', description: `${message.author} reached level ${record.level}!`, color: 'Gold' })] });
    }

    await record.save();
  }
};
