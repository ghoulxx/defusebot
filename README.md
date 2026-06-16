# DiscBot

A multipurpose Discord bot built with Node.js, discord.js v14, and MongoDB.

## Setup

1. Copy `.env.example` to `.env` and fill in `TOKEN` and `MONGO_URI`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the bot:
   ```bash
   npm start
   ```

## Configuration

The bot uses prefix commands. The default prefix is `!` and can be customized per server in the database.

## Commands

Use the bot by sending messages such as `!balance`, `!giveaway`, or `!voicemaster`.

## Environment Variables

- `TOKEN` — Discord bot token
- `MONGO_URI` — MongoDB connection string

## Hosting Notes

See `HOSTING.md` for deployment advice and recommended hosting options.
