const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    InteractionCollector
  } = require("discord.js"),
  fetch = require("node-fetch");
module.exports = {
  data: {
    name: "urban",
    description: "Search the Urban Dictionary for a word.",
    options: [
      {
        type: 3, // String
        name: "word",
        description: "The word to search for.",
        required: true
      }
    ]
  },
  run: async (client, interaction) => {
    await interaction.deferReply();
    const word = interaction.options.getString("word"),
      headers = {
        "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
        "x-rapidapi-key": process.env.URBANKEY,
        useQueryString: true
      },
      res = await fetch(
        `https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${encodeURIComponent(
          word
        )}`,
        { headers }
      ).catch((e) => {
        console.error(e);
        return interaction.editReply("Error fetching definition.");
      });
    if (!res || !res.json) return;

    const { list } = await res.json();

    if (!list.length) return interaction.editReply("No results found.");

    const menu = new MessageSelectMenu().setCustomId(interaction.id).setPlaceholder("Select Page");
    list.forEach((_, i) => menu.addOptions([{ label: (i + 1).toString(), value: i.toString() }]));

    const message = await interaction.editReply({
      content: "Page 1",
      embeds: [createDef(list[0])],
      components: [new MessageActionRow().addComponents(menu)]
    });
    const filter = (i) => i.customId === interaction.id && i.user.id === interaction.user.id;
    const collector = new InteractionCollector(client, { filter, time: 6e5, message });
    collector.on("collect", (i) =>
      i.update({
        content: `Page ${parseInt(i.values[0]) + 1}`,
        embeds: [createDef(list[i.values[0]])]
      })
    );
    collector.on("end", () => interaction.editReply({ content: "_ _", components: [] }));
  }
};

function createDef(def) {
  const embed = new MessageEmbed()
    .setColor("#2F3136")
    .setAuthor({ name: def.author })
    .setTitle(def.word, def.permalink)
    .setDescription(def.definition.replace(/\[([^\]]+)\]/g, "$1").slice(0, 2048))
    .setTimestamp(def.written_on)
    .setFooter({ text: `👍 ${def.thumbs_up} 👎 ${def.thumbs_down}` });
  if (def.example)
    embed.addField("Example", def.example.replace(/\[([^\]]+)\]/g, "$1").slice(0, 1024));
  return embed;
}
