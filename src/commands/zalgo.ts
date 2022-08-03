import { APIChatInputApplicationCommandInteraction, APIChatInputApplicationCommandInteractionData, APIInteractionResponse, ApplicationCommandOptionType, InteractionResponseType, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import zalgo from 'to-zalgo';
import unzalgo from 'to-zalgo/banish';
const commandData: RESTPostAPIChatInputApplicationCommandsJSONBody = {
  name: 'zalgo',
  description: 'Zalgo or unzalgo text',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "options",
      description: "To zalgo or unzalgo",
      required: true,
      choices: [
        { name: "zalgo", value: "zalgo" },
        { name: "unzalgo", value: "unzalgo" }
      ]
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "text",
      description: "Text to convert",
      required: true
    }
  ]
};

const exec = async (interaction: APIChatInputApplicationCommandInteraction): Promise<APIInteractionResponse | Error> => {
  const option = interaction.data.options!.find(({ name }) => name === 'options')!;
  const txt = interaction.data.options!.find(({ name }) => name === 'text')!;
  if (option.type !== ApplicationCommandOptionType.String) throw new Error("Invalid option type");
  if (txt.type !== ApplicationCommandOptionType.String) throw new Error("Invalid text type");

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: option.value === "zalgo" ? zalgo(txt.value) : unzalgo(txt.value),
    },
  };
}

export { commandData, exec };