import {
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIChatInputApplicationCommandInteraction as Interaction,
  APIInteractionResponseChannelMessageWithSource as Response,
  ApplicationCommandOptionType as OptionType,
  InteractionResponseType as ResponseType,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command
} from "discord-api-types/v10";
import zalgo from "to-zalgo";
import unzalgo from "to-zalgo/banish";

const commandData: Command = {
  name: "zalgo",
  description: "Zalgo or unzalgo text",
  options: [
    {
      type: OptionType.String,
      name: "options",
      description: "To zalgo or unzalgo",
      required: true,
      choices: [
        { name: "zalgo", value: "zalgo" },
        { name: "unzalgo", value: "unzalgo" }
      ]
    },
    {
      type: OptionType.String,
      name: "text",
      description: "Text to convert",
      required: true
    }
  ]
};

const exec = async (interaction: Interaction, res: any): Promise<void> => {
  const option = <StringOption>interaction.data.options!.find(({ name }) => name === "options")!;
  const txt = <StringOption>interaction.data.options!.find(({ name }) => name === "text")!;

  const response: Response = {
    type: ResponseType.ChannelMessageWithSource,
    data: {
      content: option.value === "zalgo" ? zalgo(txt.value) : unzalgo(txt.value)
    }
  };
  return res.send(response);
};

export { commandData, exec };
