// Command Handler
import { APIChatInputApplicationCommandInteraction, APIInteractionResponse, InteractionResponseType } from "discord-api-types/v10";
async function handle(interaction: APIChatInputApplicationCommandInteraction): Promise<APIInteractionResponse> {
  const commandName = interaction.data.name;
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: commandName,
    },
  };
}

export default handle;