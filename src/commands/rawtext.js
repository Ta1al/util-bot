const { Util } = require('discord.js');

module.exports = {
  data: {
    type: 3,
    name: 'rawtext'
  },
  run: (_client, interaction) => {
    const msg = interaction.options.resolved.messages.first();
    interaction.reply({
      content: `**Message Characters**: ${msg.content.length}`,
      embeds: [
        {
          color: '#2F3136',
          description: Util.escapeMarkdown(msg.content).slice(0, 4096)
        }
      ],
      ephemeral: true
    });
  }
};