const { Client, Intents } = require('discord.js');
const { TOKEN } = process.env;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on("interactionCreate", int => {
  try {
    require(`./commands/${int.commandName}.js`).run(client, int);
  } catch (e) {
    int.reply('Command not found.');
  }
})

client.login(TOKEN);