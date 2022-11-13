import { RESTPostAPIChatInputApplicationCommandsJSONBody as Command } from "discord-api-types/v10";
import { respondWithMessage } from "../utils/functions";
import { InteractionResponse } from "../utils/types";

const data: Command = {
  name: "ping",
  description: "Replies with Pong!"
};

async function run(): Promise<InteractionResponse> {
  return respondWithMessage({ content: "Pong!" });
}

export default { data, run };
