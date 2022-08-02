// Command Handler
import { InteractionResponseType } from "discord-interactions";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
async function handle(message: any) {
  const interaction = message as APIChatInputApplicationCommandInteraction;
  const commandName = interaction.data.name;
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: commandName,
    },
  };
}

export default handle;