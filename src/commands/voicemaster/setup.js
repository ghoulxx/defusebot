const VoiceMasterConfig = require('../../models/VoiceMasterConfig');
const { createEmbed } = require('../../utils/embed');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'voicemaster',
  description: 'Setup Join-to-Create voice channels for the server.',
  aliases: [],
  async execute(message) {
    const guild = message.guild;
    const category = await guild.channels.create({
      name: 'Voice Master',
      type: 4
    });

    const joinChannel = await guild.channels.create({
      name: 'Join to Create',
      type: 2,
      parent: category,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
        }
      ]
    });

    const interfaceChannel = await guild.channels.create({
      name: 'voice-master',
      type: 0,
      parent: category,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
        }
      ]
    });

    await VoiceMasterConfig.findOneAndUpdate(
      { guildId: guild.id },
      {
        joinToCreateChannelId: joinChannel.id,
        categoryId: category.id,
        interfaceChannelId: interfaceChannel.id
      },
      { upsert: true }
    );

    await interfaceChannel.send({ embeds: [createEmbed({
      title: 'Voice Master Setup Complete',
      description: `Join the voice channel ${joinChannel} and the bot will create your own temporary room.
Use commands in this server to manage your room once it is created.`
    })]});

    return message.reply({ embeds: [createEmbed({
      title: 'VoiceMaster configured',
      description: `Created category: ${category}\nJoin channel: ${joinChannel}\nInterface channel: ${interfaceChannel}`,
      color: 'Green'
    })]});
  }
};
