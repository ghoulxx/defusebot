const AntinukeConfig = require('../../models/AntinukeConfig');
const { createEmbed } = require('../../utils/embed');

module.exports = {
  name: 'antinuke',
  description: 'Enable or disable antinuke protection.',
  aliases: [],
  async execute(message, args) {
    const option = args[0]?.toLowerCase();
    if (!['on', 'off'].includes(option)) return message.reply({ embeds: [createEmbed({ title: 'Usage', description: 'Use `!antinuke on` or `!antinuke off`.', color: 'Orange' })] });
    const enabled = option === 'on';
    await AntinukeConfig.findOneAndUpdate({ guildId: message.guild.id }, { enabled }, { upsert: true });
    return message.reply({ embeds: [createEmbed({ title: 'Antinuke updated', description: `Antinuke protection has been ${enabled ? 'enabled' : 'disabled'}.`, color: 'Green' })] });
  }
};
