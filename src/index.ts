import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import fs from "fs";
import https from "https";
import handle from "./handler";
import event from "events";
import {
  APIApplicationCommandInteraction as Interaction,
  APIChatInputApplicationCommandInteraction as ChatCommand,
  APIMessageComponentInteraction as ComponentInteraction
} from "discord-api-types/v10";
import {
  isChatInputApplicationCommandInteraction,
  isContextMenuApplicationCommandInteraction,
  isMessageComponentInteraction
} from "discord-api-types/utils/v10";

const emitter = new event.EventEmitter();
const app = express();

const options = {
  cert: fs.readFileSync(process.env.CERT_PATH || "./cert.pem"),
  key: fs.readFileSync(process.env.KEY_PATH || "./key.pem")
};

const httpsServer = https.createServer(options, app);

// --------You can remove this-----
app.use(express.static("public"));
app.get("/", (_req, res) => {
  res.redirect("/index.html");
});
// --------------------------------

app.post("/interactions", verifyKeyMiddleware(process.env.PUBLIC_KEY || ""), async (req, res) => {
  const message: Interaction | ComponentInteraction = req.body;
  if (isMessageComponentInteraction(message)) return emitter.emit(message.message.interaction!.id, message, res);
  if (isChatInputApplicationCommandInteraction(message) || isContextMenuApplicationCommandInteraction(message)) {
    return await handle(message as ChatCommand, res);
  }
});

// app.listen(process.env.PORT || 80, () => console.log('Listening'))

httpsServer.listen(443, () => {
  console.log("Server started!");
});

export default emitter;
