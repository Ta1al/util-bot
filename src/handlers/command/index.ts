import { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10";
import { Env, InteractionResponse } from "../../utils/types";
import { respondWithMessage } from "../../utils/functions";
import chatInput from "./slash";

async function main(
  interaction: APIApplicationCommandInteraction,
  env: Env
): Promise<InteractionResponse> {
  if (isChatInputApplicationCommandInteraction(interaction)) return chatInput(interaction, env);
  // Context menu command.
  else return respondWithMessage({ content: "Not yet." });
}

export default main;
