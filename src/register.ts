import fs from 'fs';
import fetch from 'node-fetch';
const id = process.env.APPLICATION_ID, token = process.env.TOKEN;
const arr: any[] = [];

fs.readdirSync(__dirname + '/commands').forEach((file) => {
  const { commandData } = require(`./commands/${file}`);
  arr.push(commandData);
});

const url = `https://discord.com/api/v10/applications/${id}/commands`;

fetch(url, {
  method: 'PUT',
  body: JSON.stringify(arr),
  headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
}).then(res => res.json()).then(console.log);