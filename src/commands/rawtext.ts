import {
  ApplicationCommandType as CommandType,
  RESTPostAPIContextMenuApplicationCommandsJSONBody as Command,
  APIMessageApplicationCommandInteraction as Interaction,
  APIInteractionResponseChannelMessageWithSource as Response,
  InteractionResponseType as ResponseType
} from "discord-api-types/v10";
import escapeMarkdown from "../util/markdownEscape";

const commandData: Command = {
  type: CommandType.Message,
  name: "rawtext"
};

const exec = async (interaction: Interaction, res: any) => {
  const data = interaction.data;
  const message = data.resolved.messages[data.target_id]!;

  const response: Response = {
    type: ResponseType.ChannelMessageWithSource,
    data: {
      content: `**Message Characters:** ${message.content.length}`,
      embeds: [
        {
          description: escapeMarkdown(message.content),
          color: 0x2f3136
        }
      ]
    }
  };
  res.send(response);
};

export { commandData, exec };
