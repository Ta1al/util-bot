import fs from 'fs';
import fetch from 'node-fetch';
const id = process.env.APPLICATION_ID, token = process.env.TOKEN;
const arr: any[] = [];

fs.readdirSync(__dirname + '/commands').forEach((file) => {
  const { commandData } = require(`./commands/${file}`);
  arr.push(commandData);
});

const url = (id: String | undefined) => `https://discord.com/api/v10/applications/${id}/commands`;
console.log(JSON.stringify(arr))
fetch(url(id), {
  method: 'PUT',
  body: JSON.stringify(arr),
  headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
}).then(res => res.json()).then(console.log);

setTimeout(() => {
  true
}, 30000);
