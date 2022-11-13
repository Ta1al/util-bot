import {
  APIApplicationCommandInteraction,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command
} from "discord-api-types/v10";
import { Env, InteractionResponse } from "../../utils/types";

export default async function chatInput(
  interaction: APIChatInputApplicationCommandInteraction,
  env: Env
): Promise<InteractionResponse> {
  let subCommandGroup: APIApplicationCommandSubcommandGroupOption | undefined;
  let subCommand: APIApplicationCommandSubcommandOption | undefined;

  if (interaction.data.options) {
    subCommandGroup = interaction.data.options.find(
      option => option.type === ApplicationCommandOptionType.SubcommandGroup
    ) as APIApplicationCommandSubcommandGroupOption;
    subCommand = interaction.data.options.find(
      option => option.type === ApplicationCommandOptionType.Subcommand
    ) as APIApplicationCommandSubcommandOption;
  }
  const commandPath = [interaction.data.name, subCommandGroup?.name, subCommand?.name]
    .filter(Boolean)
    .join("/");

  const command = (await import(`../commands/${commandPath}`)) as {
    data: Command;
    run: (interaction: APIApplicationCommandInteraction, env: Env) => Promise<InteractionResponse>;
  };

  return command.run(interaction, env);
}
