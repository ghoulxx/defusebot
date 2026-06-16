const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const { Client, Collection, IntentsBitField, Partials } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

const { loadCommands } = require('./src/handlers/commandHandler');
const { loadEvents } = require('./src/handlers/eventHandler');

if (!process.env.TOKEN || !process.env.MONGO_URI) {
  console.error('Missing environment variables. Please set TOKEN and MONGO_URI.');
  process.exit(1);
}

const mongoUri = process.env.MONGO_URI.trim().replace(/^"|"$/g, '');
const botToken = process.env.TOKEN.trim().replace(/^"|"$/g, '');

// Start application after MongoDB connection to avoid DB buffering errors
(async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }

  // load commands/events after DB is ready
  loadCommands(client, path.join(__dirname, 'src', 'commands'));
  loadEvents(client, path.join(__dirname, 'src', 'events'));

  try {
    await client.login(botToken);
  } catch (err) {
    console.error('Failed to login Discord client:', err);
    process.exit(1);
  }
})();
