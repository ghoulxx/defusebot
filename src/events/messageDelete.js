const { createEmbed } = require('../utils/embed');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  name: 'messageDelete',
  async execute(client, message) {
    if (!message.guild || message.author?.bot) return;
    const cfg = await GuildConfig.findOne({ guildId: message.guild.id });
    if (!cfg?.messageLoggingEnabled) return;
    const logId = cfg.messageLogChannelId;
    if (!logId) return;
    const ch = message.guild.channels.cache.get(logId) || await message.guild.channels.fetch(logId).catch(() => null);
    if (!ch) return;

    const fields = [
      { name: 'Author', value: `${message.author.tag} (${message.author.id})`, inline: true },
      { name: 'Channel', value: `<#${message.channel.id}>`, inline: true }
    ];
    if (message.content) fields.push({ name: 'Content', value: message.content.substring(0, 1024) });
    if (message.attachments && message.attachments.size) fields.push({ name: 'Attachments', value: message.attachments.map(a => a.url).join('\n') });

    await ch.send({ embeds: [createEmbed({ title: 'Message Deleted', fields, timestamp: new Date() })] }).catch(() => null);
  }
};
