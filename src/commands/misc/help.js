const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'help',
  description: 'List available commands or show details for a specific command.',
  aliases: ['h'],
  async execute(message, args) {
    const client = message.client;
    const cmds = new Map();
    // collect only primary commands (avoid duplicates from aliases)
    for (const [, command] of client.commands) {
      if (!cmds.has(command.name)) cmds.set(command.name, command);
    }

    if (args.length) {
      const name = args[0].toLowerCase();
      const command = client.commands.get(name);
      if (!command) return message.reply({ embeds: [createEmbed({ title: 'Help', description: 'Command not found.' })] });
      const desc = `**Name:** ${command.name}\n**Description:** ${command.description || 'No description.'}\n**Aliases:** ${(command.aliases || []).join(', ') || 'None'}`;
      return message.reply({ embeds: [createEmbed({ title: `Help — ${command.name}`, description: desc })] });
    }

    const lines = [];
    for (const [name, command] of cmds) {
      lines.push(`**${name}** — ${command.description || 'No description.'}`);
    }

    const description = lines.join('\n');
    return message.reply({ embeds: [createEmbed({ title: 'Commands', description })] });
  }
};
