module.exports = {
  data: {
    type: 2,
    name: 'userinfo'
  },
  run: (_client, interaction) => {
    const user = interaction.options.resolved.users.first(),
      member = interaction.options.resolved.members?.first();
    interaction.reply({
      ephemeral: true,
      embeds: [
        {
          author: {
            name: `${user.tag} (${user.id})`
          },
          thumbnail: { url: user.displayAvatarURL({ dynamic: true, size: 1024 }) },
          title: 'Basic Information',
          description: [
            `**Account Created**: <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
            `**Joined**: ${member ? `<t:${Math.floor((member.joinedTimestamp) / 1000)}:R>` : 'N/A'}`
          ].join('\n'),
          fields: [
            {
              name: 'Permissions',
              value: member?.permissions.toArray().map(perm => `\`${perm}\``).join(', ') || 'N/A'
            }
          ]
        }
      ]
    });
  }
};