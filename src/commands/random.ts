import {
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  ApplicationCommandOptionType as OptionType,
  APIChatInputApplicationCommandInteraction as Interaction,
  InteractionResponseType as ResponseType,
  APIApplicationCommandInteractionDataIntegerOption as IntegerOption,
  APIApplicationCommandSubcommandOption as SubcommandOption
} from "discord-api-types/v10";
import fetch from "node-fetch";
import { respond, updateMessage } from "../util";

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
  const type = interaction.data.options![0].name;

  if (type === "coinflip") {
    const number = parseInt(await generateRandom(1, 0, 100, 10));
    const result = number % 2 === 0 ? "heads" : "tails";
    updateMessage({ content: result }, interaction.application_id, interaction.token);
  } else if (type === "numbers") {
    const { options } = <SubcommandOption>interaction.data.options![0];
    const { value: num } = <IntegerOption>(<unknown>options![0]);
    const { value: min } = <IntegerOption>(<unknown>options![1]);
    const { value: max } = <IntegerOption>(<unknown>options![2]);
    const { value: base } = <IntegerOption>(<unknown>options![3]) || { value: 10 };

    const numbers = await generateRandom(num, min, max, base);
    updateMessage(
      { content: numbers.split("\n").join("\t").slice(0, 2000) },
      interaction.application_id,
      interaction.token
    );
  }
};

export { commandData, exec };

async function generateRandom(num: number, min: number, max: number, base: number) {
  return await fetch(
    `https://www.random.org/integers/?num=${num}&min=${min}&max=${max}&col=1&base=${base}&format=plain&rnd=new`
  ).then(res => res.text());
}
