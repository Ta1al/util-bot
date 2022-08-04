import {
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIApplicationCommandInteractionDataIntegerOption as IntegerOption,
  APIApplicationCommandInteractionDataBooleanOption as BooleanOption,
  APIChatInputApplicationCommandInteraction as Interaction,
  APIInteractionResponse as Response,
  ApplicationCommandOptionType as OptionType,
  InteractionResponseType as ResponseType,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  MessageFlags
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

const exec = async (interaction: Interaction): Promise<Response> => {
  if(interaction.member?.user.id !== process.env.OWNER_ID) return {
    type: ResponseType.ChannelMessageWithSource,
    data: {
      content: "You are not allowed to use this command",
      flags: MessageFlags.Ephemeral
    }
  }

  const code = <StringOption>interaction.data.options!.find(({ name }) => name === "code")!;
  const depth = <IntegerOption>interaction.data.options!.find(({ name }) => name === "depth")!;
  const ephemeral = <BooleanOption>interaction.data.options!.find(({ name }) => name === "ephemeral")!;

  return {
    type: ResponseType.DeferredChannelMessageWithSource,
    data: {
      flags: ephemeral.value ? MessageFlags.Ephemeral : undefined
    }
  };
}

export { commandData, exec };