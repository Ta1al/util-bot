import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import fs from 'fs';
import https from 'https';
import handle from './handler';
import { APIChatInputApplicationCommandInteraction, APIInteraction, InteractionType } from 'discord-api-types/v10';

const app = express();

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH || './cert.pem'),
  key: fs.readFileSync(process.env.KEY_PATH || './key.pem'),
}

const httpsServer = https.createServer(options, app);

// --------You can remove this-----
app.use(express.static('public'));
app.get('/', (_req, res) => {
  res.redirect('/index.html');
});
// --------------------------------

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY || ''), async (req, res) => {
  const message: APIInteraction = req.body;
  if (message.type === InteractionType.ApplicationCommand) {
    return await handle(message as APIChatInputApplicationCommandInteraction, res);
  }
})

// app.listen(process.env.PORT || 80, () => console.log('Listening'))

httpsServer.listen(443, () => {
  console.log('Server started!');
});