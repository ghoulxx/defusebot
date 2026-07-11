const { PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('./embed');

function parseDuration(value) {
  if (!value) return null;
  const match = value.trim().match(/^([0-9]+)([smhdw])$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
  return amount * multipliers[unit];
}

function formatDuration(ms) {
  if (!ms || ms <= 0) return '0s';
  const parts = [];
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(' ');
}

function canModerate(message, target) {
  if (!message.member || !target) return false;
  if (message.member.id === message.guild.ownerId) return true;
  if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return false;
  if (target.id === message.guild.ownerId || target.id === message.client.user.id) return false;
  if (target.permissions?.has(PermissionFlagsBits.Administrator)) return false;
  return true;
}

function errorEmbed(title, description) {
  return createEmbed({ title, description, color: 'Red' });
}

module.exports = {
  parseDuration,
  formatDuration,
  canModerate,
  errorEmbed
};
