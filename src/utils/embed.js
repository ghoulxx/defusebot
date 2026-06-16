const { EmbedBuilder } = require('discord.js');

function createEmbed(options = {}) {
  const embed = new EmbedBuilder();
  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.color) embed.setColor(options.color);
  else embed.setColor('#2f3136');
  if (options.fields) embed.addFields(options.fields);
  if (options.footer) embed.setFooter({ text: options.footer });
  if (options.timestamp) embed.setTimestamp(options.timestamp);
  if (options.author) embed.setAuthor(options.author);
  return embed;
}

module.exports = { createEmbed };
