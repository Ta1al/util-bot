import {
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIChatInputApplicationCommandInteraction as Interaction,
  APIInteractionResponse as Response,
  ApplicationCommandOptionType as OptionType,
  InteractionResponseType as ResponseType,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command
} from "discord-api-types/v10";

const commandData: Command = {
  name: "eval",
  description: "Evaluate code",
  options: [
    {
      type: OptionType.String,
      name: "code",
      description: "The code to evaluate",
      required: true
    },
    {
      type: OptionType.Integer,
      name: "depth",
      description: "Depth of output content"
    },
    {
      type: OptionType.Boolean,
      name: "ephemeral",
      description: "Whether or not the response message is ephemeral"
    }
  ],
  // default_member_permissions: "ADMINISTRATOR",
  dm_permission: false
};

export { commandData };