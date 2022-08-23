import {
  RESTPostAPIContextMenuApplicationCommandsJSONBody as Command,
  ApplicationCommandType as CommandType,
  APIUserApplicationCommandInteraction as Interaction,
  InteractionResponseType as ResponseType,
  MessageFlags
} from "discord-api-types/v10";
import { respond } from "../util";

const commandData: Command = {
  type: CommandType.User,
  name: "userinfo"
};

const exec = async (interaction: Interaction, res: any) => {
  const data = interaction.data;
  const user = data.resolved.users[data.target_id]!;

  respond(res, {
    type: ResponseType.ChannelMessageWithSource,
    data: {
      content: `**User:** ${user.username}#${user.discriminator} (${user.id})`,
      flags: MessageFlags.Ephemeral
    }
  });
};

export { commandData, exec };
