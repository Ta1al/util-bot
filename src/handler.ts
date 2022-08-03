// Command Handler
import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType } from "discord-api-types/v10";

async function handle(interaction: APIChatInputApplicationCommandInteraction): Promise<APIInteractionResponse> {
  let response;
  const commandName = interaction.data.name;
  try {
    response = await require(`./commands/${commandName}`).exec(interaction);
  } catch (error) {
    console.error(error);
    response = {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: '⚠️ An error occurred while executing this command!',
        ephemeral: true,
      },
    }
  }
  return response;
}

export default handle;