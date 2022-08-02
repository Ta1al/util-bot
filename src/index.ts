import express from 'express';
import { verifyKeyMiddleware, InteractionType } from 'discord-interactions';
import fs from 'fs';
import https from 'https';
import handle from './handler';

const app = express();

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH || './cert.pem'),
  key: fs.readFileSync(process.env.KEY_PATH || './key.pem'),
}

const httpsServer = https.createServer(options, app);

// --------You can remove this-----
app.use(express.static('public'));
app.get('/', express.raw(), (req, res) => {
  res.redirect('/index.html');
});
// --------------------------------

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY || ''), async (req, res) => {
  const message = req.body;
  if (message.type === InteractionType.APPLICATION_COMMAND) {
    const response = await handle(message);
    return res.send(response);
  }
})

// app.listen(process.env.PORT || 80, () => console.log('Listening'))

httpsServer.listen(443, () => {
  console.log('Server started!');
});