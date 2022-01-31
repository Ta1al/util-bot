const util = require('util');
module.exports = {
  data: {
    name: 'eval',
    description: 'Evaluate Javascript code',
    options: [
      {
        type: 3,
        name: 'code',
        description: 'The code to evaluate',
        required: true
      },
      {
        type: 4,
        name: 'depth',
        description: 'Depth of output content'
      },
      {
        type: 5,
        name: 'ephemeral',
        description: 'Whether or not the response message is ephemeral'
      }
    ],
    defaultPermissions: false,
    permissions: {
      id: process.env.OWNER,
      type: 'USER',
      permission: true
    }
  },
  async run (_client, interaction) {
    await interaction.deferReply({ ephemeral: interaction.options.getBoolean('ephemeral') ?? true });
    try {
      const evaled = await eval(interaction.options.get('code').value);
      const result = util.inspect(evaled, { depth: interaction.options.getInteger('depth') ?? 0 });
      if(result.length > 1990) {
        interaction.editReply({ files: [ { name:'result.js', attachment: Buffer.from(result) } ] });
      } else {
        interaction.editReply(`\`\`\`js\n${result}\`\`\``);
      }
    } catch (e) {
      interaction.editReply({ content: `\`\`\`js\n${e}\`\`\`` });
    }
  }
  
};