const parse = require("parse-duration"),
  { Schema, model } = require("mongoose"),
  schema = new Schema({
    userID: String,
    guildID: String,
    channelID: String,
    messageLink: String,
    message: String,
    time: Number
  }),
  Reminder = model("Reminder", schema);

module.exports = {
  data: {
    name: "reminder",
    description: "Get, set, or delete reminders.",
    options: [
      {
        name: "set",
        description: "Set a reminder.",
        type: 1,
        options: [
          {
            type: 3,
            name: "time",
            description:
              "The time to set the reminder for. (More than 1 minute and less than 2 years)",
            required: true
          },
          {
            type: 3,
            name: "message",
            description: "The message to send with the reminder. (Must be less than 200 characters)"
          }
        ]
      },
      {
        name: "get",
        description: "Get a list of your reminders.",
        type: 1
      },
      {
        name: "delete",
        description: "Delete a reminder.",
        type: 1,
        options: [
          {
            type: 3,
            name: "id",
            description: "The ID of the reminder to delete.",
            required: true
          }
        ]
      }
    ]
  },

  async run(_client, interaction) {
    switch (interaction.options.getSubcommand()) {
      case "set":
        const duration = parse(interaction.options.getString("time")),
          message = interaction.options.getString("message");

        if (duration === null) return interaction.reply("Invalid time.");
        if (duration < 6e4) return interaction.reply("Time must be at least 1 minute.");
        if (duration > 63113852e3) return interaction.reply("Time must be less than 2 years.");
        if (message?.length > 2e2)
          return interaction.reply("Message must be less than 200 characters.");

        const m = await interaction.deferReply({ fetchReply: true });

        const oldRem = await Reminder.find({
          userID: interaction.user.id,
          guildID: interaction.guild.id
        });

        if(oldRem.length >= 10) return interaction.editReply("You can't have more than 10 reminders.");

        const time = Date.now() + duration;

        const newRem = new Reminder({
          userID: interaction.user.id,
          guildID: interaction.guildId,
          channelID: interaction.channelId,
          messageLink: m.url,
          message,
          time
        });

        const doc = await newRem.save();

        interaction.editReply({
          content: `Reminder set! I\'ll remind you <t:${parseInt(time / 1000)}:R>.`,
          embeds: [
            {
              description: `Reminder ID: ${doc._id}`,
              color: "2f3136"
            }
          ],
          fetchReply: true
        });
        break;

      case "get":
        await interaction.deferReply();
        const reminders = await Reminder.find({
          userID: interaction.user.id,
          guildID: interaction.guildId
        });

        if (reminders.length === 0) return interaction.reply("You have no reminders.");

        interaction.editReply({
          embeds: [
            {
              title: "Reminders",
              color: "2f3136",
              fields: reminders.map((r) => ({
                name: `\`${r._id}\``,
                value: `<t:${parseInt(r.time / 1000)}:R> ${r.message || "[No Message]"}`,
                inline: true
              }))
            }
          ]
        });
        break;

      case "delete":
        const id = interaction.options.getString("id");

        await interaction.deferReply();

        const rem = await Reminder.findOne({
          _id: id,
          userID: interaction.user.id,
          guildID: interaction.guildId
        });

        if (!rem) return interaction.editReply("That reminder doesn't exist.");

        await Reminder.deleteOne({ _id: id });

        interaction.editReply(`Reminder \`${id}\` deleted.`);
        break;
    }
  },

  async init(client) {
    setInterval(async () => {
      const reminders = await Reminder.find({});
      if (reminders.length > 0) {
        reminders.forEach(async (r) => {
          if (r.time <= Date.now()) {
            client.guilds.cache
              .get(r.guildID)
              .channels.cache.get(r.channelID)
              .send({
                content: `Reminder for <@${r.userID}>: ${r.message || ""}`,
                embeds: [
                  {
                    description: `[Link to Reminder](${r.messageLink})`,
                    color: "#2f3136"
                  }
                ]
              });
            await r.remove();
          }
        });
      }
    }, 1000);
  }
};
