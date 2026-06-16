const TicketConfig = require('../models/TicketConfig');
const Ticket = require('../models/Ticket');
const Giveaway = require('../models/Giveaway');
const ButtonRole = require('../models/ButtonRole');
const { createEmbed } = require('../utils/embed');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'ticket_open') {
      const config = await TicketConfig.findOne({ guildId: interaction.guildId });
      if (!config) {
        return interaction.reply({ content: 'Ticket system is not configured.', ephemeral: true });
      }
      const existing = await Ticket.findOne({ guildId: interaction.guildId, openerId: interaction.user.id, status: 'open' });
      if (existing) {
        return interaction.reply({ content: 'You already have an open ticket.', ephemeral: true });
      }
      const category = await interaction.guild.channels.fetch(config.categoryId).catch(() => null);
      if (!category) {
        return interaction.reply({ content: 'Ticket category is unavailable.', ephemeral: true });
      }
      const everyone = interaction.guild.roles.everyone;
      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`.substring(0, 90),
        type: 0,
        parent: category,
        permissionOverwrites: [
          { id: everyone.id, deny: ['ViewChannel'] },
          { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
          ...config.supportRoleIds.map((id) => ({ id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] }))
        ]
      });
      await Ticket.create({ guildId: interaction.guildId, channelId: channel.id, openerId: interaction.user.id });
      await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
      return channel.send({ embeds: [createEmbed({ title: 'Ticket opened', description: `Hello ${interaction.user}, a support member will be with you shortly.` })] });
    }

    if (interaction.customId.startsWith('giveaway_enter_')) {
      const messageId = interaction.customId.replace('giveaway_enter_', '');
      const giveaway = await Giveaway.findOne({ messageId });
      if (!giveaway) {
        return interaction.reply({ content: 'This giveaway is not available.', ephemeral: true });
      }
      if (giveaway.entries.includes(interaction.user.id)) {
        return interaction.reply({ content: 'You are already entered in this giveaway.', ephemeral: true });
      }
      giveaway.entries.push(interaction.user.id);
      await giveaway.save();
      return interaction.reply({ content: `You have entered the giveaway for **${giveaway.prize}**.`, ephemeral: true });
    }

    const buttonRole = await ButtonRole.findOne({ guildId: interaction.guildId, customId: interaction.customId });
    if (buttonRole) {
      const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
      if (!member) return interaction.reply({ content: 'Unable to resolve your member profile.', ephemeral: true });
      const role = interaction.guild.roles.cache.get(buttonRole.roleId);
      if (!role) return interaction.reply({ content: 'Role is no longer available.', ephemeral: true });
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role).catch(() => null);
        return interaction.reply({ content: `Removed ${role.name} from you.`, ephemeral: true });
      }
      await member.roles.add(role).catch(() => null);
      return interaction.reply({ content: `Assigned ${role.name} to you.`, ephemeral: true });
    }
  }
};
