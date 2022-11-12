import {
  APIApplicationCommandInteraction,
  APIPingInteraction,
  InteractionResponseType,
  InteractionType
} from "discord-api-types/v10";
import { Env, InteractionResponse } from "./types";
import { Router } from "itty-router";

const router = Router();

router.get("/", () => new Response("No."));

router.post("/", async function (request: Request, _env: Env): Promise<InteractionResponse> {
  const message: APIApplicationCommandInteraction | APIPingInteraction = await request.json();

  if (message.type === InteractionType.Ping) {
    console.log("Handling Ping request");
    return new InteractionResponse({ type: InteractionResponseType.Pong });
  }
  return new InteractionResponse({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: "hi" }
  });
});

export default router;
