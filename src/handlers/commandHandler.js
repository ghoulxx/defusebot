const fs = require('fs');
const path = require('path');

function loadCommands(client, commandsPath) {
  const files = fs.readdirSync(commandsPath, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(commandsPath, file.name);
    if (file.isDirectory()) {
      loadCommands(client, fullPath);
      continue;
    }
    if (!file.name.endsWith('.js')) continue;

    const command = require(fullPath);
    if (!command.name || !command.execute) continue;
    client.commands.set(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        client.commands.set(alias, command);
      }
    }
  }
}

module.exports = { loadCommands };
