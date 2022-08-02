import express from 'express';
import { verifyKeyMiddleware, InteractionType, InteractionResponseType } from 'discord-interactions';
import fs from 'fs';
import https from 'https';
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

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY || ''), (req, res) => {
  const message = req.body;
  console.log(message);
  if (message.type === InteractionType.APPLICATION_COMMAND) {
    res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'Hello world',
      },
    });
  }
})

// app.listen(process.env.PORT || 80, () => console.log('Listening'))

httpsServer.listen(443, () => {
  console.log('Server started!');
});