import {
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIApplicationCommandInteractionDataIntegerOption as IntegerOption,
  APIApplicationCommandInteractionDataBooleanOption as BooleanOption,
  APIChatInputApplicationCommandInteraction as Interaction,
  ApplicationCommandOptionType as OptionType,
  APIInteractionResponseDeferredChannelMessageWithSource as Response,
  InteractionResponseType as ResponseType,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  MessageFlags,
  RESTPatchAPIInteractionOriginalResponseFormDataBody as Patch,
  RouteBases,
  Routes
} from "discord-api-types/v10";
import fetch from "node-fetch";
import util from "util";
import FormData from "form-data";

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
    return res.send({
      type: ResponseType.ChannelMessageWithSource,
      data: {
        content: "You are not allowed to use this command",
        flags: MessageFlags.Ephemeral
      }
    });

  const code = <StringOption>interaction.data.options!.find(({ name }) => name === "code")!;
  const depth = <IntegerOption | undefined>interaction.data.options!.find(({ name }) => name === "depth");
  const ephemeral = <BooleanOption | undefined>interaction.data.options!.find(({ name }) => name === "ephemeral");

  const response: Response = {
    type: ResponseType.DeferredChannelMessageWithSource,
    data: {
      flags: ephemeral && !ephemeral.value ? undefined : MessageFlags.Ephemeral
    }
  };
  await res.send(response);

  update(interaction, code.value, depth?.value);
};

async function update(interaction: Interaction, code: string, depth = 0): Promise<void> {
  let patch: Patch;
  const url = `${RouteBases.api}${Routes.webhookMessage(interaction.application_id, interaction.token)}`;
  const evaled = await eval(code);
  const result = util.inspect(evaled, { depth });
  const long = result.length > 1990; // 2000 - 10 (for code block) 
  patch = {
    content: long ? undefined : `\`\`\`js\n${result}\`\`\``,
    attachments: long ? [{ id: "0", filename: "output.txt" }] : undefined
  };
  const formData = new FormData();
  formData.append("payload_json", JSON.stringify(patch), { contentType: "application/json" });
  long ? formData.append("files[0]", Buffer.from(result), { filename: "output.txt" }) : "";

  fetch(url, { method: "PATCH", body: formData });
  // .then((res) => res.json());
  // .then(console.log);
}

export { commandData, exec };
