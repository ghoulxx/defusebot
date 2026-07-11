const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'whois',
  description: 'Show information about a user.',
  async execute(message, args) {
    const target = message.mentions.members.first() || message.member;
    const roles = target.roles.cache.filter((role) => role.id !== message.guild.id).map((role) => role.toString()).slice(0, 10);

    return message.reply({
      embeds: [
        createEmbed({
          title: `👤 ${target.user.tag}`,
          fields: [
            { name: 'ID', value: target.user.id, inline: true },
            { name: 'Joined', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: 'Created', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Roles', value: roles.length ? roles.join(' ') : 'None', inline: false }
          ]
        })
      ]
    });
  }
};
