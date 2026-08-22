function normalizePunishment(value) {
  const normalized = String(value || '').toLowerCase();
  return normalized === 'ban' ? 'ban' : 'kick';
}

function parseTrustedTarget(rawValue) {
  if (!rawValue) return null;
  const trimmed = rawValue.trim();
  const mentionMatch = trimmed.match(/^<@!?([0-9]+)>$/) || trimmed.match(/^<@&([0-9]+)>$/);
  if (mentionMatch) return mentionMatch[1];
  const numericMatch = trimmed.match(/^([0-9]{17,20})$/);
  if (numericMatch) return numericMatch[1];
  return null;
}

function parseAntinukeAction(args = []) {
  const [command, ...rest] = args;
  const action = command?.toLowerCase();
  if (!action) return { type: 'help' };

  if (action === 'on' || action === 'off') {
    return { type: 'toggle', enabled: action === 'on' };
  }

  if (action === 'punishment') {
    const [name, value] = rest;
    return { type: 'punishment', key: name, value: normalizePunishment(value) };
  }

  return { type: 'help' };
}

module.exports = {
  normalizePunishment,
  parseTrustedTarget,
  parseAntinukeAction
};
