import {
  APIChatInputApplicationCommandInteraction as Interaction,
  RESTPostAPIChatInputApplicationCommandsJSONBody as Command,
  RESTPatchAPIInteractionOriginalResponseJSONBody as Patch,
  InteractionResponseType as ResponseType,
  APIApplicationCommandInteractionDataStringOption as StringOption,
  APIMessageComponentSelectMenuInteraction as SelectMenuInteraction
} from "discord-api-types/v10";
import fetch from "node-fetch";
import ud from "urban-dictionary";
import emitter from "../index";

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
  await res.send({ type: ResponseType.DeferredChannelMessageWithSource });

  const { value: term } = <StringOption>interaction.data.options!.find(o => o.name === "term")!;

  try {
    const definitions = await ud.define(term);
    update(interaction, {
      components: [makeSelectMenu(definitions)],
      embeds: [makeEmbed(definitions[0])]
    });

    const callback = (select: SelectMenuInteraction, selectRes: any) =>
      handleSelection(select, selectRes, interaction, definitions);

    emitter.on(interaction.id, callback);
    setTimeout(() => emitter.removeListener(interaction.id, callback), 60000);
  } catch (error) {
    update(interaction, { content: `⚠ Definition not found!` });
  }
};

async function handleSelection(
  select: SelectMenuInteraction,
  res: any,
  interaction: Interaction,
  definitions: ud.DefinitionObject[]
) {
  if (select.member?.user.id !== interaction.member?.user.id) return;
  if (select.user?.id !== interaction.user?.id) return;

  const value = parseInt(select.data.values[0]);
  return await res.send({
    type: ResponseType.UpdateMessage,
    data: {
      components: [makeSelectMenu(definitions, value)],
      embeds: [makeEmbed(definitions[value])]
    }
  });
}

function makeSelectMenu(defs: ud.DefinitionObject[], value = 0) {
  return {
    type: 1,
    components: [
      {
        type: 3,
        custom_id: `urban`,
        options: Array.from(defs).map((d, i) => {
          return {
            label: `${i + 1}`,
            value: `${i}`,
            description: `Author: ${d.author}`,
            default: i === value
          };
        })
      }
    ]
  };
}

function makeEmbed(def: ud.DefinitionObject) {
  return {
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
  };
}

function update(interaction: Interaction, patch: Patch) {
  const url = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`;
  fetch(url, { method: "PATCH", body: JSON.stringify(patch), headers: { "Content-Type": "application/json" } });
}

export { commandData, exec };
