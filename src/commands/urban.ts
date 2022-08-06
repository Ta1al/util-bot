import {
  APIChatInputApplicationCommandInteraction as Interaction,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  APIInteractionResponseDeferredChannelMessageWithSource as Response,
  RESTPatchAPIInteractionOriginalResponseJSONBody as Patch,
  InteractionResponseType as ResponseType,
  APIApplicationCommandInteractionDataStringOption as StringOption
} from "discord-api-types/v10";
import fetch from "node-fetch";
import ud from "urban-dictionary";

const commandData: Command = {
  name: "urban",
  description: "Searches Urban Dictionary for the given term",
  options: [
    {
      type: 3, // string
      name: "term",
      description: "The term to search for",
      required: true
    }
  ]
};

const exec = async (interaction: Interaction, res: any) => {
  const response: Response = {
    type: ResponseType.DeferredChannelMessageWithSource
  };
  await res.send(response);

  const { value: term } = <StringOption>interaction.data.options!.find(o => o.name === "term")!;

  ud.define(term)
    .then(defs => {
      const def = defs[0];
      const obj: Patch = {
        embeds: [
          {
            author: { name: `Author: ${def.author}` },
            title: `${def.word}`,
            description: def.definition.replace(/\[([^\]]+)\]/g, "$1").slice(0, 4096),
            url: def.permalink,
            color: 0x2f3136,
            footer: { text: `${def.thumbs_up} 👍 | ${def.thumbs_down} 👎` },
            timestamp: def.written_on,
            fields: [
              {
                name: "Example",
                value: def.example.replace(/\[([^\]]+)\]/g, "$1").slice(0, 1024) || "N/A"
              }
            ]
          }
        ]
      };
      update(interaction, obj)
    })
    .catch(e => {
      console.error(e);
      const obj: Patch = {
        content: `⚠ An error occurred.`
      };
      update(interaction, obj);
    });
};

function update(interaction: Interaction, obj: Patch) {
  const url = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`;
  fetch(url, { method: "PATCH", body: JSON.stringify(obj), headers: { "Content-Type": "application/json" } });
}

export { commandData, exec };
