const {
  MessageEmbed,
  MessageActionRow,
  MessageAttachment,
  MessageSelectMenu,
  InteractionCollector
} = require("discord.js");
module.exports = {
  data: {
    name: "wolfram",
    description: "Wolfram Alpha: Compute answers using AI",
    options: [
      {
        type: 3,
        name: "type",
        description: "Type of response",
        required: true,
        choices: [
          { name: "Image", value: "img" },
          { name: "Short", value: "short" },
          { name: "Full", value: "full" }
        ]
      },
      {
        type: 3,
        name: "query",
        description: "The query to be computed",
        required: true
      },
      {
        type: 5,
        name: "get_raw",
        description: "Whether to get the raw JSON response with full type"
      }
    ]
  },
  run: async (client, interaction) => {
    await interaction.deferReply();
    const wa = require("wolfram-alpha-api")(process.env.WOLFRAM_API_KEY),
      type = interaction.options.getString("type"),
      query = interaction.options.getString("query"),
      raw = interaction.options.getBoolean("get_raw");
    if (type === "img") {
      return wa
        .getSimple(query)
        .then((res) => {
          const image = new MessageAttachment(
            Buffer.from(res.split(",")[1], "base64"),
            "result.png"
          );
          interaction.editReply({ files: [image] });
        })
        .catch((err) => interaction.editReply(err.message));
    }
    if (type === "short") {
      return wa
        .getShort(query)
        .then((res) => interaction.editReply(res))
        .catch((err) => interaction.editReply(err.message));
    }
    if (type === "full") {
      return wa
        .getFull({ input: query, output: "JSON" })
        .then(async (result) => {
          const res = JSON.parse(result).queryresult;
          if (raw)
            return interaction.editReply({
              files: [{ name: "result.js", attachment: Buffer.from(result) }]
            });
          if (res.success) {
            const pods = res.pods.slice(0, 25).sort((a, b) => a.position - b.position);
            const menu = new MessageSelectMenu().setCustomId(interaction.id);
            pods.forEach((p, i) => menu.addOptions([{ label: p.title, value: i.toString() }]));
            const message = await interaction.editReply({
              embeds: [makeEmbed(pods, 0)],
              components: [new MessageActionRow().addComponents(menu)]
            });
            const filter = (i) =>
              i.customId === interaction.id && i.user.id === interaction.user.id;
            const collector = new InteractionCollector(client, { filter, time: 6e5, message });
            collector.on("collect", (i) => i.update({ embeds: [makeEmbed(pods, i.values[0])] }));
            collector.on("end", () => interaction.editReply({ components: [] }));
          } else {
            return interaction.editReply(
              res.error.msg === "Invalid appid"
                ? "Try again later (wolfram api is clunky sometimes)"
                : res.error.msg
            );
          }
        })
        .catch((err) => {
          console.error(err);
          interaction.editReply(err.message);
        });
    }
  }
};

function makeEmbed(pods, index) {
  const embed = new MessageEmbed()
      .setColor("#2F3136")
      .setDescription(pods[index].scanner)
      .setTitle(pods[index].title),
    img = pods.find((pod) => pod.title === "Image");
  if (img) embed.setThumbnail(img.subpods[0].img.src);
  pods[index].subpods.forEach((subpod) => {
    if (subpod.plaintext.length) embed.addField(subpod.title + "_ _", subpod.plaintext);
    else embed.setImage(subpod.img.src);
  });
  return embed;
}
