const { InteractionCollector } = require("discord.js");
const { isError } = require("util");

const HLTV = require("hltv-api").default;
module.exports = {
  data: {
    name: "hltv",
    description: "HLTV.org API",
    options: [
      {
        type: 1,
        name: "get_news",
        description: "Get latest news from HLTV.org"
      },
      {
        type: 1,
        name: "get_results",
        description: "Get latest match results"
      },
      {
        type: 1,
        name: "get_matches",
        description: "Get ongoing/upcoming matches"
      },
      {
        type: 1,
        name: "get_match_by_id",
        description: "Get match details by ID",
        options: [
          {
            type: 4,
            name: "id",
            description: "The Match ID",
            required: true
          }
        ]
      },
      {
        type: 1,
        name: "get_top_players",
        description: "Get top players"
      },
      {
        type: 1,
        name: "get_player_by_id",
        description: "Get player stats by ID",
        options: [
          {
            type: 4,
            name: "id",
            description: "The Player ID",
            required: true
          }
        ]
      },
      {
        type: 1,
        name: "get_top_teams",
        description: "Get top teams"
      },
      {
        type: 1,
        name: "get_team_by_id",
        description: "Get team stats by ID",
        options: [
          {
            type: 4,
            name: "id",
            description: "The Team ID",
            required: true
          }
        ]
      }
    ]
  },

  run: async (client, interaction) => {
    const type = interaction.options.getSubcommand();
    const msg = await interaction.deferReply({ fetchReply: true });
    switch (type) {
      case "get_news":
        const news = await HLTV.getNews();
        interaction.editReply({
          embeds: [
            {
              title: "HLTV.org News",
              color: "#2f3136",
              fields: news.map((n) => ({
                name: n.title,
                value: `[Link](${n.link}) - <t:${parseInt(new Date(n.time).getTime() / 1000)}:R>\n${
                  n.description
                }`
              }))
            }
          ]
        });
        break;
      case "get_results":
        const results = (await HLTV.getResults()).slice(0, 25);
        interaction.editReply({
          embeds: [
            {
              description: "Choose a match to view the results",
              color: "#2f3136"
            }
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: `${interaction.id}_results`,
                  placeholder: "Choose Match",
                  options: results.map((r) => ({
                    label: r.teams[0].name + " vs " + r.teams[1].name,
                    description: r.event.name,
                    value: `${r.matchId}`
                  }))
                }
              ]
            }
          ]
        });

        const filter = (i) =>
          i.customId === `${interaction.id}_results` && i.user.id === interaction.user.id;
        const collector = new InteractionCollector(client, { filter, time: 6e4, msg });

        collector.on("collect", async (i) => {
          const match = results.find((m) => m.matchId === parseInt(i.values[0]));
          const teams = match.teams.sort((a, b) => b.result - a.result);
          i.update({
            embeds: [
              {
                color: "#2f3136",
                footer: { text: `Match ID: ${match.matchId}` },
                thumbnail: { url: match.event.logo },
                image: { url: teams[0].logo, height: 100, width: 100 },
                timestamp: new Date(match.time),
                title: match.event.name,
                description: `
                **Map:** ${match.maps}
                
                **${teams[0].name}** vs ${teams[1].name}
                **Result:** **${teams[0].result}** - ${teams[1].result}
                `
              }
            ]
          });
        });
        collector.on("end", () => interaction.editReply({ components: [] }));
        break;
      case "get_matches":
        const matches = (await HLTV.getMatches()).slice(0, 25);
        const stars = {
          0: "",
          1: "⭐",
          2: "⭐⭐",
          3: "⭐⭐⭐",
          4: "⭐⭐⭐⭐",
          5: "⭐⭐⭐⭐⭐"
        };
        interaction.editReply({
          embeds: [
            {
              color: "#2f3136",
              fields: [
                matches.map((m) => ({
                  name: `${stars[m.stars]} ${m.teams[0].name} vs ${m.teams[1].name}`,
                  value: `
                  **ID:** \`${m.id}\`
                  **Event:** ${m.event.name}
                  **Map:** ${m.maps}
                  **Match Start:** <t:${parseInt(new Date(m.time).getTime() / 1000)}:R>
                  `,
                  inline: true
                }))
              ]
            }
          ]
        });
        break;
        ca;
      case "get_match_by_id":
        const match = await HLTV.getMatchById(interaction.options.getInteger("id")).catch((e) => e);
        if (!match.teams) return interaction.editReply({ content: "No match found" });
        const teams = match.teams.sort((a, b) => b.result - a.result);
        const description = `
        ${teams[0].name} vs ${teams[1].name}

        **Result:** ${teams[0].result} - ${teams[1].result}

        **Maps:** ${match.maps
          .map(
            (m) =>
              `**${m.name}:** ${
                (Number(m.teams[0].result.first.rounds) ?? 0) +
                (Number(m.teams[0].result.second.rounds) ?? 0) +
                m.teams[0].result.ext
              } - ${
                (Number(m.teams[1].result.first.rounds) ?? 0) +
                (Number(m.teams[1].result.second.rounds) ?? 0) +
                m.teams[1].result.ext
              }`
          )
          .join("\n")}
        `;
        const embed = {
          color: "#2f3136",
          footer: { text: `Match ID: ${match.id}` },
          timestamp: new Date(match.time),
          thumbnail: { url: teams[0].logo },
          title: match.event.name,
          description
        };
        interaction.editReply({
          embeds: [embed],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: `${interaction.id}_match_team`,
                  placeholder: "Choose Team",
                  options: teams.map((t) => ({
                    label: t.name,
                    value: t.name
                  }))
                }
              ]
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: `${interaction.id}_match_map`,
                  placeholder: "Choose Map",
                  options: match.maps.map((m) => ({
                    label: m.name,
                    description: `Pick: ${m.pick || "N/A"}`,
                    value: m.name
                  }))
                }
              ]
            }
          ]
        });

        const filter2 = (i) =>
          i.customId.startsWith(`${interaction.id}_match`) && i.user.id === interaction.user.id;
        const collector2 = new InteractionCollector(client, { filter2, time: 6e4, msg });

        collector2.on("collect", async (i) => {
          switch (i.customId) {
            case `${interaction.id}_match_team`:
              const team = teams.find((t) => t.name === i.values[0]);
              embed.fields = [
                team.players.map((p) => ({
                  name: p.nickname,
                  value: Object.keys(p)
                    .map((k) => `**${`${k[0].toUpperCase()}${k.slice(1)}`}**: ${p[k]}`)
                    .join("\n"),
                  inline: true
                }))
              ];
              embed.thumbnail = { url: team.logo };
              embed.description = description + `\n\n__**${team.name} Player Stats**__`;
              i.update({
                embeds: [embed]
              });
              break;

            case `${interaction.id}_match_map`:
              const map = match.maps.find((m) => m.name === i.values[0]);
              embed.fields = [
                map.teams.map((t) => ({
                  name: t.name,
                  value: `
                  **First Half:** ${Number(t.result.first.rounds) ?? "-"} (${
                    t.result.first.side ?? "-"
                  })
                  **Second Half:** ${Number(t.result.second.rounds) ?? "-"} (${
                    t.result.second.side ?? "-"
                  })

                  ${t.result.ext ? `**Overtime:** ${t.result.ext}` : ""}
                  `,
                  inline: true
                }))
              ];
              embed.description = description + `\n\n__**${map.name} Map Stats**__`;
              embed.thumbnail = { url: teams[0].logo };
              i.update({
                embeds: [embed]
              });
              break;
          }
        });
        collector2.on("end", () => interaction.editReply({ components: [] }));
        break;
      case "get_top_players":
        const topPlayers = (await HLTV.getTopPlayers()).slice(0, 25);
        interaction.editReply({
          embeds: [
            {
              color: "#2f3136",
              fields: [
                topPlayers.map((p) => ({
                  name: `${p.nickname} (${p.rating})`,
                  value: `
                **ID:** \`${p.id}\`
                **Team:** ${p.team}
                **K/D:** ${p.kd}
                **Maps Played:** ${p.mapsPlayed}
                `,
                  inline: true
                }))
              ]
            }
          ]
        });
        break;

        ca;
      case "get_player_by_id":
        const player = await HLTV.getPlayerById(interaction.options.getInteger("id")).catch((e) => e);
        if (isError(player)) return interaction.editReply({ content: "No player found" });
        interaction.editReply({
          embeds: [
            {
              color: "#2f3136",
              image: { url: player.image },
              title: player.nickname,
              description: `
              **ID:** \`${player.id}\`
              **Team:** ${player.team?.name}
              **Name:** ${player.name}
              **Age:** ${player.age}
              **Rating:** ${player.rating}
              **Impact:** ${player.impact}
              **DPR:** ${player.dpr}
              **APR:** ${player.apr}
              **KAST:** ${player.kast}
              **KPR:** ${player.kpr}
              **Headshots:** ${player.headshots}
              **Maps Played:** ${player.mapsPlayed}
              `
            }
          ]
        });
        break;
      case "get_top_teams":
        const topTeams = (await HLTV.getTopTeams()).slice(0, 25);
        interaction.editReply({
          embeds: [
            {
              color: "#2f3136",
              description: topTeams
                .map((t) => `**\`${t.ranking}.\`** ${t.name} (ID: ${t.id})`)
                .join("\n")
            }
          ],
          components: [
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: `${interaction.id}_top_teams`,
                  placeholder: "Select a Team to view players",
                  options: topTeams.map((t) => ({
                    label: t.name,
                    value: t.name
                  }))
                }
              ]
            }
          ]
        });

        const filter3 = (i) =>
          i.customId === `${interaction.id}_top_teams` && i.user.id === interaction.user.id;

        const collector3 = new InteractionCollector(client, { filter3, time: 6e4, msg });

        collector3.on("collect", async (i) => {
          const team = topTeams.find((t) => t.name === i.values[0]);

          i.update({
            embeds: [
              {
                color: "#2f3136",
                title: team.name,
                thumbnail: { url: team.logo },
                fields: [
                  team.players.map((p) => ({
                    name: `${p.fullname}`,
                    value: `**Country:** ${p.country.name}\n[Image](${p.image})`,
                    inline: true
                  }))
                ]
              }
            ]
          });
        });

        collector3.on("end", () => interaction.editReply({ components: [] }));
        break;
      case "get_team_by_id":
        const team = await HLTV.getTeamById(interaction.options.getInteger("id"));
        interaction.editReply({
          embeds: [
            {
              color: "#2f3136",
              title: team.name,
              thumbnail: { url: team.logo },
              description: `**Ranking:** ${team.ranking}
              **Coach:** ${team.coach}
              **Average Player Age:** ${team.averagePlayerAge}`,
              fields: [
                team.players.map((p) => ({
                  name: `${p.fullname}`,
                  value: `**Country:** ${p.country.name}\n[Image](${p.image})`,
                  inline: true
                }))
              ]
            }
          ]
        });
        break;
    }
  }
};
