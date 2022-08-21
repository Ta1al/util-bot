import {
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  ApplicationCommandOptionType as OptionType,
  APIChatInputApplicationCommandInteraction as Interaction,
  InteractionResponseType as ResponseType
} from "discord-api-types/v10";
import { respond } from "../util";

const commandData: Command = {
  name: "random",
  description: "Uses random.org for randomness",
  options: [
    {
      type: OptionType.Subcommand,
      name: "coinflip",
      description: "Flips a coin"
    },
    {
      type: OptionType.Subcommand,
      name: "numbers",
      description: "Generates a random number(s)",
      options: [
        {
          type: OptionType.Integer,
          name: "num",
          description: "The number of random numbers to generate",
          required: true
        },
        {
          type: OptionType.Integer,
          name: "min",
          description: "The minimum number",
          required: true
        },
        {
          type: OptionType.Integer,
          name: "max",
          description: "The maximum number",
          required: true
        },
        {
          type: OptionType.Integer,
          name: "base",
          description: "The base (numeral system) to use for the number(s) [Default decimal (10)]",
          choices: [
            { name: "hexadecimal", value: 16 },
            { name: "decimal", value: 10 },
            { name: "octal", value: 8 },
            { name: "binary", value: 2 }
          ]
        }
      ]
    }
  ]
};

const exec = async (interaction: Interaction, res: any) => {
  await respond(res, { type: ResponseType.DeferredChannelMessageWithSource });
  console.log(interaction);
};

export { commandData, exec };
