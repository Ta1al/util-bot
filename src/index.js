const { Client, Intents } = require("discord.js"),
  { TOKEN, MONGO_URI } = process.env,
  client = new Client({ intents: [Intents.FLAGS.GUILDS] }),
  { connect } = require("mongoose");

client.once("ready", () => {
  connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  require("./commands/reminder.js").init(client);
  console.log("Ready!");
});

client.on("interactionCreate", (int) => {
  if (int.type === "MESSAGE_COMPONENT") return;
  try {
    require(`./commands/${int.commandName}.js`).run(client, int);
  } catch (e) {
    int.reply({ content: "Command not found.", ephemeral: true });
  }
});

client.on("rateLimit", (data) => console.log(`Rate limit exceeded: ${data.path}`, data));

client.on("error", (e) => console.log("ClientError", e));
client.on("warn", (e) => console.log("ClientWarning", e));
process.on("uncaughtException", (e) => console.log("UncaughtException", e));
process.on("unhandledRejection", (e) => console.log("UnhandledRejection", e));

client.login(TOKEN);
