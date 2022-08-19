import {
  ApplicationCommandType as CommandType,
  RESTPostAPIContextMenuApplicationCommandsJSONBody as Command,
  APIMessageApplicationCommandInteraction as Interaction,
  InteractionResponseType as ResponseType,
  MessageFlags
} from "discord-api-types/v10";
import { escapeMarkdown } from "../util/index";

const commandData: Command = {
  type: CommandType.Message,
  name: "rawtext"
};

const exec = async (interaction: Interaction, res: any) => {
  const data = interaction.data;
  const message = data.resolved.messages[data.target_id]!;

  if (!message.content.length)
    return res.json({
      type: ResponseType.ChannelMessageWithSource,
      data: { content: "⚠ Message has no content", flags: MessageFlags.Ephemeral }
    });

  res.send({
    type: ResponseType.ChannelMessageWithSource,
    data: {
      content: `**Message Characters:** ${message.content.length}`,
      flags: MessageFlags.Ephemeral,
      embeds: [
        {
          description: escapeMarkdown(message.content),
          color: 0x2f3136
        }
      ]
    }
  });
};

export { commandData, exec };
