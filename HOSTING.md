# Hosting DiscBot

This bot uses a prefix command system and stores configuration in MongoDB.

## Recommended setup

- Node.js 18 or newer
- MongoDB Atlas or other hosted MongoDB instance
- A process manager such as PM2 or a hosting provider that automatically restarts the bot on failure

## Environment

Provide the bot with these environment variables:

- `TOKEN`
- `MONGO_URI`

## Start

Run:

```bash
npm start
```
