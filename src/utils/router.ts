import {
  APIInteraction,
  InteractionResponseType,
  InteractionType
} from "discord-api-types/v10";
import { Env, InteractionResponse } from "./types";
import { Router } from "itty-router";
import commandHandler from "../handlers/command";
import { respond, respondWithMessage } from "../utils/functions";

const router = Router();

router.get("/", () => new Response("No."));

router.post("/", async function (request: Request, env: Env): Promise<InteractionResponse> {
  const interaction: APIInteraction = await request.json();

  switch (interaction.type) {
    case InteractionType.Ping:
      return respond({ type: InteractionResponseType.Pong });

    case InteractionType.ApplicationCommand:
      return commandHandler(interaction, env);

    // TODO: Handle other interaction types.
    // case InteractionType.MessageComponent:
    //   return ;

    // case InteractionType.ApplicationCommandAutocomplete:
    //   return ;

    // case InteractionType.ModalSubmit:
    //   return ;

    default:
      return respondWithMessage({ content: "Not implemented yet." });
  }
});

export default router;
