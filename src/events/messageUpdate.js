const { createEmbed } = require('../utils/embed');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  name: 'messageUpdate',
  async execute(client, oldMessage, newMessage) {
    if (!newMessage.guild) return;
    if (oldMessage?.author?.bot) return;
    const cfg = await GuildConfig.findOne({ guildId: newMessage.guild.id });
    if (!cfg?.messageLoggingEnabled) return;
    const logId = cfg.messageLogChannelId;
    if (!logId) return;
    const ch = newMessage.guild.channels.cache.get(logId) || await newMessage.guild.channels.fetch(logId).catch(() => null);
    if (!ch) return;

    const fields = [
      { name: 'Author', value: `${newMessage.author.tag} (${newMessage.author.id})`, inline: true },
      { name: 'Channel', value: `<#${newMessage.channel.id}>`, inline: true }
    ];
    if (oldMessage?.content) fields.push({ name: 'Before', value: oldMessage.content.substring(0, 1024) });
    if (newMessage.content) fields.push({ name: 'After', value: newMessage.content.substring(0, 1024) });

    await ch.send({ embeds: [createEmbed({ title: 'Message Edited', fields, timestamp: new Date() })] }).catch(() => null);
  }
};
