const { createEmbed } = require('../../utils/embed');

// Command category mapping (fallback if command.category not set)
const CATEGORY_MAP = {
  // Moderation
  'ban': 'Moderation',
  'kick': 'Moderation',
  'purge': 'Moderation',
  // Economy
  'balance': 'Economy',
  'deposit': 'Economy',
  'withdraw': 'Economy',
  'pay': 'Economy',
  'daily': 'Economy',
  'rob': 'Economy',
  'coinflip': 'Economy',
  'blackjack': 'Economy',
  'work': 'Economy',
  'setbalance': 'Economy',
  // Leveling
  'level': 'Leveling',
  'leaderboard': 'Leveling',
  'reward-add': 'Leveling',
  // Giveaways
  'giveaway': 'Giveaways',
  'giveaways': 'Giveaways',
  // Tickets
  'ticket': 'Tickets',
  // Voice Master
  'voicemaster': 'Voice Master',
  'voiceclaim': 'Voice Master',
  'voicehide': 'Voice Master',
  'voicelimit': 'Voice Master',
  'voicelock': 'Voice Master',
  'voiceunlock': 'Voice Master',
  'voicepermit': 'Voice Master',
  'voicerename': 'Voice Master',
  'voicereveal': 'Voice Master',
  'voicetransfer': 'Voice Master',
  // Roles
  'reactionrole': 'Roles',
  'buttonrole': 'Roles',
  // Configuration
  'welcome': 'Configuration',
  'prefix': 'Configuration',
  'antinuke': 'Configuration',
  // Utility
  'help': 'Utility',
  'diagnose': 'Utility'
};

function getCategory(command) {
  return command.category || CATEGORY_MAP[command.name] || 'Other';
}

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

    // Group commands by category
    const grouped = {};
    for (const [name, command] of cmds) {
      const category = getCategory(command);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(`**${name}** — ${command.description || 'No description.'}`);
    }

    // Sort categories alphabetically and build fields
    const categories = Object.keys(grouped).sort();
    const fields = categories.map(cat => ({
      name: cat,
      value: grouped[cat].join('\n'),
      inline: false
    }));

    return message.reply({ embeds: [createEmbed({ title: 'Commands', description: 'Use `$help <command>` for more info.', fields })] });
  }
};
