import {
  RESTPostAPIContextMenuApplicationCommandsJSONBody as Command,
  ApplicationCommandType as CommandType
} from "discord-api-types/v10";

const commandData: Command = {
  type: CommandType.User,
  name: "userinfo"
};

export { commandData };
