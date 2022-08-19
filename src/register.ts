import "dotenv/config";
import { RouteBases, Routes } from 'discord-api-types/v10';
import fs from 'fs';
import fetch from 'node-fetch';
const id = process.env.APPLICATION_ID!, token = process.env.TOKEN;
const arr: any[] = [];

fs.readdirSync(__dirname + '/commands').forEach((file) => {
  const { commandData } = require(`./commands/${file}`);
  arr.push(commandData);
});

const url = `${RouteBases.api}${Routes.applicationCommands(id)}`;

fetch(url, {
  method: 'PUT',
  body: JSON.stringify(arr),
  headers: { Authorization: `Bot ${token}`, 'Content-Type': 'application/json' },
}).then(res => res.json()).then(console.log);