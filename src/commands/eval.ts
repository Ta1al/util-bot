import {
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIApplicationCommandInteractionDataIntegerOption as IntegerOption,
  APIApplicationCommandInteractionDataBooleanOption as BooleanOption,
  APIChatInputApplicationCommandInteraction as Interaction,
  ApplicationCommandOptionType as OptionType,
  InteractionResponseType as ResponseType,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  MessageFlags
} from "discord-api-types/v10";
import util from "util";
import { respond, updateMessageWithAttachment } from "../util";

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

const exec = async (interaction: Interaction, res: any): Promise<void> => {
  if (interaction.member?.user.id !== process.env.OWNER_ID)
    return respond(res, {
      type: ResponseType.ChannelMessageWithSource,
      data: {
        content: "You are not allowed to use this command",
        flags: MessageFlags.Ephemeral
      }
    });

  const code = <StringOption>interaction.data.options!.find(({ name }) => name === "code")!;
  const depth = <IntegerOption | undefined>(
    interaction.data.options!.find(({ name }) => name === "depth")
  );
  const ephemeral = <BooleanOption | undefined>(
    interaction.data.options!.find(({ name }) => name === "ephemeral")
  );

  await respond(res, {
    type: ResponseType.DeferredChannelMessageWithSource,
    data: {
      flags: ephemeral && !ephemeral.value ? undefined : MessageFlags.Ephemeral
    }
  });
  const evaled = await eval(code.value);
  const result = util.inspect(evaled, { depth: depth?.value ?? 0 });
  updateMessageWithAttachment(
    { content: `\`\`\`js\n${result}\`\`\`` },
    interaction.application_id,
    interaction.token,
    [{ name: "output.txt", file: Buffer.from(result) }]
  );
};


export { commandData, exec };
