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
  'richest': 'Economy',
  'poorest': 'Economy',
  'give': 'Economy',
  'take': 'Economy',
  'resetbalance': 'Economy',
  'resetalleconomy': 'Economy',
  'item': 'Economy',
  'market': 'Economy',
  'sell': 'Economy',
  'craft': 'Economy',
  'fish': 'Economy',
  'hunt': 'Economy',
  'mine': 'Economy',
  'farm': 'Economy',
  'garden': 'Economy',
  'pet': 'Economy',
  'petfeed': 'Economy',
  'petsell': 'Economy',
  'heist': 'Economy',
  'investment': 'Economy',
  'stocks': 'Economy',
  'roulette': 'Economy',
  'dice': 'Economy',
  'higherlower': 'Economy',
  'crash': 'Economy',
  'wheel': 'Economy',
  'scratch': 'Economy',
  'lootbox': 'Economy',
  'dailystreak': 'Economy',
  'weeklyreward': 'Economy',
  'monthlyreward': 'Economy',
  'vote': 'Economy',
  'boosterreward': 'Economy',
  // Leveling
  'level': 'Leveling',
  'leaderboard': 'Leveling',
  'reward-add': 'Leveling',
  'xpadd': 'Leveling',
  'xpremove': 'Leveling',
  'xpreset': 'Leveling',
  'xpresetall': 'Leveling',
  'rankcardbg': 'Leveling',
  'rankcardcolor': 'Leveling',
  'rolerewards': 'Leveling',
  'stackroles': 'Leveling',
  'levelupmessage': 'Leveling',
  'levelupchannel': 'Leveling',
  'voicexp': 'Leveling',
  'boostxp': 'Leveling',
  // Giveaways
  'giveaway': 'Giveaways',
  'giveaways': 'Giveaways',
  'glist': 'Giveaways',
  'greroll': 'Giveaways',
  'gend': 'Giveaways',
  'gpause': 'Giveaways',
  'gresume': 'Giveaways',
  'gedit': 'Giveaways',
  'gdelete': 'Giveaways',
  'gblacklist': 'Giveaways',
  'gwhitelist': 'Giveaways',
  'grequirements': 'Giveaways',
  // Tickets
  'ticket': 'Tickets',
  'ticketadd': 'Tickets',
  'ticketremove': 'Tickets',
  'ticketrename': 'Tickets',
  'tickettranscript': 'Tickets',
  'ticketlimit': 'Tickets',
  'ticketcooldown': 'Tickets',
  'ticketpanel': 'Tickets',
  'ticketreason': 'Tickets',
  'ticketmove': 'Tickets',
  'jail': 'Moderation',
  'auditlog': 'Configuration',
  'messagelog': 'Configuration',
  'joinlog': 'Configuration',
  'leavelog': 'Configuration',
  'voicelog': 'Configuration',
  'rolelog': 'Configuration',
  'nicknamelog': 'Configuration',
  'banlog': 'Configuration',
  'kicklog': 'Configuration',
  'channellog': 'Configuration',
  'emojilog': 'Configuration',
  'stickerlog': 'Configuration',
  'inviteupdatelog': 'Configuration',
  'serverupdatelog': 'Configuration',
  'threadlog': 'Configuration',
  'logignore': 'Configuration',
  'logchannel': 'Configuration',
  'farewell': 'Configuration',
  'boostmessage': 'Configuration',
  'boostchannel': 'Configuration',
  'serverinfo': 'Utility',
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
  'rolemenu': 'Roles',
  'rolepersist': 'Roles',
  'roleall': 'Roles',
  'rolebots': 'Roles',
  'rolehumans': 'Roles',
  'rolestats': 'Roles',
  'rolecolor': 'Roles',
  'roleicon': 'Roles',
  'roleinfo': 'Roles',
  'temprole': 'Roles',
  // Configuration
  'welcome': 'Configuration',
  'prefix': 'Configuration',
  'antinuke': 'Configuration',
  // Utility
  'help': 'Utility',
  'diagnose': 'Utility',
  'ping': 'Utility',
  'uptime': 'Utility',
  'botinfo': 'Utility',
  'invite': 'Utility',
  'support': 'Utility',
  'whois': 'Utility',
  'ping': 'Utility',
  'uptime': 'Utility',
  'invite': 'Utility',
  'support': 'Utility',
  'changelog': 'Utility',
  'botinfo': 'Utility',
  'servericon': 'Utility',
  'serverbanner': 'Utility',
  'serveremojis': 'Utility',
  'rolelist': 'Utility',
  'channellist': 'Utility',
  'membercount': 'Utility',
  'firstmessage': 'Utility',
  'permissions': 'Utility',
  'permcheck': 'Utility',
  'whois': 'Utility',
  'id': 'Utility',
  'timestamp': 'Utility',
  'embed': 'Utility',
  'say': 'Utility',
  'edit': 'Utility',
  'react': 'Utility',
  // Fun
  'meme': 'Fun',
  'joke': 'Fun',
  'dadjoke': 'Fun',
  'fact': 'Fun',
  'quote': 'Fun',
  'emojify': 'Fun',
  'ascii': 'Fun',
  'reverse': 'Fun',
  'mock': 'Fun',
  'clap': 'Fun',
  'hug': 'Fun',
  'kiss': 'Fun',
  'slap': 'Fun',
  'pat': 'Fun',
  'cuddle': 'Fun',
  'bite': 'Fun',
  'tickle': 'Fun',
  'trivia': 'Fun',
  'wordle': 'Fun',
  'hangman': 'Fun',
  'tictactoe': 'Fun',
  'connect4': 'Fun',
  'guessthenumber': 'Fun',
  'typingtest': 'Fun',
  'iq': 'Fun',
  'rate': 'Fun',
  'simprate': 'Fun',
  'gayrate': 'Fun',
  // Reminders
  'remindlist': 'Reminders',
  'remindcancel': 'Reminders',
  'timer': 'Reminders',
  'countdown': 'Reminders',
  'schedule': 'Reminders',
  'unschedule': 'Reminders',
  // Server
  'setup': 'Server',
  'reset': 'Server',
  'export': 'Server',
  'import': 'Server',
  'backup': 'Server',
  'restoreserver': 'Server',
  'emojisteal': 'Server',
  'stickersteal': 'Server',
  'serverboostlist': 'Server',
  'boosterrole': 'Server',
  // Antinuke
  'accountage': 'Antinuke',
  // Music
  'play': 'Music',
  'pause': 'Music',
  'resume': 'Music',
  'stop': 'Music',
  'skip': 'Music',
  'queue': 'Music',
  'nowplaying': 'Music',
  'volume': 'Music'
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

    // Sort categories alphabetically and build a wider, two-column-style layout
    const categories = Object.keys(grouped).sort();
    const fields = categories.map(cat => ({
      name: cat,
      value: grouped[cat].slice(0, 8).join('\n'),
      inline: true
    }));

    return message.reply({ embeds: [createEmbed({ title: 'Commands', description: 'Use `$help <command>` for more info.', fields })] });
  }
};
