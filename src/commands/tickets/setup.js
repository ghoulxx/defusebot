const TicketConfig = require('../../models/TicketConfig');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'ticketsetup',
  description: 'Setup the ticket panel.',
  aliases: [],
  async execute(message) {
    const [channelId, categoryId, roleId] = message.content.split(/\s+/).slice(1);
    const channel = message.guild.channels.cache.get(channelId);
    const category = message.guild.channels.cache.get(categoryId);
    const role = message.guild.roles.cache.get(roleId);
    if (!channel || channel.type !== 0 || !category || category.type !== 4 || !role) {
      return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!ticketsetup <panel-channel-id> <category-id> <support-role-id>`.', color: 'Orange' })] });
    }
    const button = { type: 2, style: 1, label: 'Open Ticket', custom_id: 'ticket_open' };
    const msg = await channel.send({ embeds: [createEmbed({ title: 'Ticket Panel', description: 'Click the button to open a support ticket.' })], components: [{ type: 1, components: [button] }] });
    await TicketConfig.findOneAndUpdate({ guildId: message.guild.id }, { categoryId: category.id, supportRoleIds: [role.id], panelChannelId: channel.id, panelMessageId: msg.id }, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Ticket system ready', description: `Ticket panel posted in ${channel}.`, color: 'Green' })] });
  }
};
