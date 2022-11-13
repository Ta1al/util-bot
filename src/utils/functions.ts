import {
  APIInteractionResponseCallbackData as ResponseCallbackData,
  RESTPostAPIInteractionCallbackJSONBody as APIInteractionResponse
} from "discord-api-types/v10";
import { InteractionResponse } from "./types";

async function respond(interaction: APIInteractionResponse): Promise<InteractionResponse> {
  return new InteractionResponse(interaction);
}

async function respondWithMessage(data: ResponseCallbackData): Promise<InteractionResponse> {
  return respond({ type: 4, data });
}

export { respond, respondWithMessage };
