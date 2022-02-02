const zalgo = require("to-zalgo"),
  unzalgo = require("to-zalgo/banish");
module.exports = {
  data: {
    name: "zalgo",
    description: "Zalgo or unzalgo text",
    options: [
      {
        type: 3, // string
        name: "options",
        description: "To zalgo or unzalgo",
        required: true,
        choices: [
          { name: "zͦͨͭȧ͊͛lͤ͑͜g̓͑ͩo͕͗͋", value: "zalgo" },
          { name: "unzalgo", value: "unzalgo" }
        ]
      },
      {
        type: 3, // string
        name: "text",
        description: "Text to convert",
        required: true
      }
    ]
  },
  run: (client, interaction) => {
    const txt = interaction.options.getString("text"),
      type = interaction.options.getString("options");
    return interaction.reply(type === "zalgo" ? zalgo(txt) : unzalgo(txt));
  }
};


console.log(JSON.stringify({
  name: "zalgo",
  description: "Zalgo or unzalgo text",
  options: [
    {
      type: 3, // string
      name: "options",
      description: "To zalgo or unzalgo",
      required: true,
      choices: [
        { name: "zͦͨͭȧ͊͛lͤ͑͜g̓͑ͩo͕͗͋", value: "zalgo" },
        { name: "unzalgo", value: "unzalgo" }
      ]
    },
    {
      type: 3, // string
      name: "text",
      description: "Text to convert",
      required: true
    }
  ]
}))