const fs = require('fs');
const path = require('path');

function loadEvents(client, eventsPath) {
  const files = fs.readdirSync(eventsPath, { withFileTypes: true });
  for (const file of files) {
    if (!file.name.endsWith('.js')) continue;
    const event = require(path.join(eventsPath, file.name));
    if (!event || !event.name || !event.execute) continue;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
}

module.exports = { loadEvents };
