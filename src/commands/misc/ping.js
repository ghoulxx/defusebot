const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'ping',
  description: 'Show bot latency and API ping.',
  async execute(message) {
    const wsPing = message.client.ws.ping;
    const apiPing = Date.now() - message.createdTimestamp;

    return message.reply({
      embeds: [
        createEmbed({
          title: '🏓 Pong',
          fields: [
            { name: 'Websocket', value: `${wsPing}ms`, inline: true },
            { name: 'API', value: `${apiPing}ms`, inline: true }
          ]
        })
      ]
    });
  }
};
