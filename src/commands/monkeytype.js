const { Schema, model } = require("mongoose"),
  schema = new Schema({
    userID: String,
    apeKey: String
  }),
  ApeKey = model("ApeKey", schema);
module.exports = {
  data: {
    name: "monkeytype",
    description: "MonkeyType API",
    options: [
      {
        type: 2,
        name: "api_key",
        description: "Manage your API Key",
        options: [
          {
            type: 1,
            name: "save",
            description: "Save your API Key",
            options: [
              {
                type: 3,
                name: "key",
                description: "Your API Key",
                required: true
              },
              {
                type: 4,
                name: "confirmation",
                description: "⚠ Your key will be saved in Talal's database WITHOUT encryption. ⚠",
                choices: [
                  {
                    name: "Yes, I understand.",
                    value: 1
                  }
                ],
                required: true
              }
            ]
          },
          {
            type: 1,
            name: "remove",
            description: "Remove your API Key",
            options: [
              {
                type: 4,
                name: "confirmation",
                description: "Do you really want to remove your api key?",
                choices: [
                  {
                    name: "Yes, delete it.",
                    value: 1
                  }
                ],
                required: true
              }
            ]
          }
        ]
      },
      {
        type: 2,
        name: "personal",
        description: "Get personal bests",
        options: [
          {
            type: 1,
            name: "time",
            description: "PB in Time mode",
            options: [
              {
                type: 4,
                name: "mode",
                description: "Time limit",
                required: true,
                choices: [
                  {
                    name: "15",
                    value: 15
                  },
                  {
                    name: "30",
                    value: 30
                  },
                  {
                    name: "60",
                    value: 60
                  },
                  {
                    name: "120",
                    value: 120
                  }
                ]
              }
            ]
          },
          {
            type: 1,
            name: "words",
            description: "PB in Words mode",

            options: [
              {
                type: 4,
                name: "mode",
                description: "Word limit",
                required: true,
                choices: [
                  {
                    name: "10",
                    value: 10
                  },
                  {
                    name: "25",
                    value: 25
                  },
                  {
                    name: "50",
                    value: 50
                  },
                  {
                    name: "100",
                    value: 100
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 2,
        name: "leaderboards",
        description: "Get leaderboards",
        options: [
          {
            type: 1,
            name: "global",
            description: "Global leaderboards",
            options: [
              {
                type: 3,
                name: "mode",
                description: "Mode",
                choices: [
                  {
                    name: "Time 15",
                    value: "time15"
                  },
                  {
                    name: "Time 60",
                    value: "time60"
                  }
                ],
                required: true
              },
              {
                type: 4,
                name: "skip",
                description: "How many leaderboard entries to skip"
              },
              {
                type: 4,
                name: "limit",
                description: "How many leaderboard entries to request",
                min_value: 1,
                max_value: 25
              }
            ]
          },
          {
            type: 1,
            name: "personal",
            description: "Your rank on the leaderboard",
            options: [
              {
                type: 3,
                name: "mode",
                description: "Mode",
                choices: [
                  {
                    name: "Time 15",
                    value: "time15"
                  },
                  {
                    name: "Time 60",
                    value: "time60"
                  }
                ],
                required: true
              }
            ]
          }
        ]
      }
    ]
  },

  run: async (_client, interaction) => {
    const data = interaction.options.data[0];

    await interaction.deferReply({ ephemeral: data.name === "api_key" });
    const pKey = await ApeKey.findOne({ userID: interaction.user.id });

    switch (data.name) {
      case "api_key":
        if (data.options[0].name === "save") {
          const key = data.options[0].options[0].value;
          if (!pKey) {
            const newKey = new ApeKey({
              userID: interaction.user.id,
              apeKey: key
            });
            await newKey.save();
          } else {
            await ApeKey.findOneAndUpdate({ userID: interaction.user.id }, { apeKey: key });
          }
          await interaction.editReply("Your API Key has been saved.");
        } else {
          if (!pKey) return interaction.editReply("You don't have an API Key.");

          await ApeKey.findOneAndRemove({ userID: interaction.user.id });
          await interaction.editReply("Your API Key has been removed.");
        }
        break;
      case "personal":
        if (!pKey) return interaction.editReply("Save your API Key first.");
        if (data.options[0].name === "time") {
          const mode = data.options[0].options[0].value;
          const res = await monkey("pb", ["mode=time", `mode2=${mode}`], pKey.apeKey);

          return await interaction.editReply({
            embeds: [
              {
                color: 3092790,
                title: `${data.options[0].name} ${mode}`,
                description: res.message,
                fields: res.data.map((x) => ({
                  name: `${x.wpm}`,
                  value: formatData(x),
                  inline: true
                }))
              }
            ]
          });
        }
        if (data.options[0].name === "words") {
          const mode = data.options[0].options[0].value;
          const res = await monkey("pb", ["mode=words", `mode2=${mode}`], pKey.apeKey);

          return await interaction.editReply({
            embeds: [
              {
                color: 3092790,
                title: `${data.options[0].name} ${mode}`,
                description: res.message,
                fields: res.data.map((x) => ({
                  name: `${x.wpm}`,
                  value: formatData(x),
                  inline: true
                }))
              }
            ]
          });
        }
        break;
      case "leaderboards":
        if (!pKey) return interaction.editReply("Save your API Key first.");
        if (data.options[0].name === "global") {
          const mode = data.options[0].options[0].value;
          const skip = data.options[0].options.find((x) => x.name === "skip")?.value || 0;
          const limit = data.options[0].options.find((x) => x.name === "limit")?.value || 10;

          const res = await monkey(
            "lb",
            [
              `language=english`,
              `mode=time`,
              `mode2=${mode.slice(4)}`,
              `skip=${skip}`,
              `limit=${limit}`
            ],
            pKey.apeKey
          );

          return await interaction.editReply({
            embeds: [
              {
                color: 3092790,
                title: `${data.options[0].name} ${mode}`,
                description: res.message,
                fields: res.data.map((x) => ({
                  name: `${x.rank}`,
                  value: formatData(x),
                  inline: true
                }))
              }
            ]
          });
        }
        if (data.options[0].name === "personal") {
          const mode = data.options[0].options[0].value;
          const res = await monkey(
            "lu",
            [`language=english`, `mode=time`, `mode2=${mode.slice(4)}`],
            pKey.apeKey
          );
          
          return await interaction.editReply({
            embeds: [
              {
                color: 3092790,
                title: `${data.options[0].name} ${mode}`,
                description: res.message,
                fields: {
                  name: `${res.data.rank}`,
                  value: formatData(res.data[0] || res.data),
                  inline: true
                }
              }
            ]
          });
        }
        break;
    }
  }
};

async function monkey(type, params, key) {
  const fetch = require("node-fetch");
  const baseUrl = "https://api.monkeytype.com/";

  const headers = {
    Authorization: `ApeKey ${key}`
  };

  const types = {
    pb: "users/personalBests",
    lb: "leaderboards",
    lu: "leaderboards/rank"
  };
  const url = `${baseUrl}${types[type]}?${params.join("&")}`;

  const res = await fetch(url, { headers });
  const data = await res.json();
  if(!data.data) return { message: data.message, data: [{ msg: "no data" }] };
  if(data.errorId) return { message: data.message, data: [{ msg: data.errorId }] };
  return data;
}

function formatData(data) {
  let str = "";
  Object.keys(data).forEach((k) => {
    const key = k.charAt(0).toUpperCase() + k.slice(1);
    if (k === "timestamp") {
      str += `**${key}**: <t:${Math.floor(data[k] / 1000)}>\n`;
    } else {
      str += `**${key}**: ${data[k]}\n`;
    }
  });
  return str;
}
