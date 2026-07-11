const UserLevel = require('../models/UserLevel');
const GuildConfig = require('../models/GuildConfig');
const { createEmbed } = require('../utils/embed');

module.exports = {
  name: 'messageCreate',
  async execute(client, message) {
    if (message.author.bot || !message.guild) return;

    const guildConfig = await GuildConfig.findOne({ guildId: message.guild.id });
    const prefix = guildConfig?.prefix || '$';
    const content = message.content.trim();

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
