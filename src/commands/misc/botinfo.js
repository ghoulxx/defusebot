const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'botinfo',
  description: 'Show information about the bot.',
  async execute(message) {
    const client = message.client;
    const guildCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((sum, guild) => sum + guild.memberCount, 0);

    return message.reply({
      embeds: [
        createEmbed({
          title: '🤖 Bot Information',
          fields: [
            { name: 'Name', value: client.user.username, inline: true },
            { name: 'ID', value: client.user.id, inline: true },
            { name: 'Servers', value: `${guildCount}`, inline: true },
            { name: 'Users', value: `${userCount}`, inline: true },
            { name: 'Library', value: 'discord.js v14', inline: true },
            { name: 'Prefix', value: 'Set per server', inline: true }
          ]
        })
      ]
    });
  }
};
