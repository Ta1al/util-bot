// Command Handler
import {
  APIChatInputApplicationCommandInteraction as Interaction,
  APIInteractionResponse as Response,
  InteractionResponseType as ResponseType,
} from "discord-api-types/v10";

async function handle(
  interaction: Interaction,
  res: any
): Promise<void> {
  const commandName = interaction.data.name;
  try {
    await require(`./commands/${commandName}`).exec(interaction, res);
  } catch (error) {
    console.error(error);
    res.send({
      type: ResponseType.ChannelMessageWithSource,
      data: {
        content: "⚠️ An error occurred while executing this command!",
        ephemeral: true
      }
    });
  }
}

export default handle;
