import { RESTPostAPIInteractionCallbackJSONBody as APIInteractionResponse } from "discord-api-types/v10";

export interface Env {
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
}

export class InteractionResponse extends Response {
  constructor(body: APIInteractionResponse, init?: ResponseInit) {
    super(JSON.stringify(body), init ?? { headers: { "Content-Type": "application/json" } });
  }

  prop() {
    return "test";
  }
}
