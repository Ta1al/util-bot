const { Client, Intents } = require("discord.js"),
  { TOKEN, MONGO_URI } = process.env,
  client = new Client({ intents: [Intents.FLAGS.GUILDS] }),
  { connect } = require('mongoose');

client.once("ready", () => {
  connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  require('./commands/reminder.js').init(client);
  console.log("Ready!");
});

client.on("interactionCreate", (int) => {
  try {
    require(`./commands/${int.commandName}.js`).run(client, int);
  } catch (e) {
    int.reply("Command not found.");
  }
});

client.login(TOKEN);
