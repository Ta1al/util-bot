module.exports = {
  data: {
    name: 'random',
    description: 'Uses random.org for randomness',
    options: [
      {
        type: 1, 
        name: 'coinflip',
        description: 'Flips a coin'
      },
      {
        type: 1, 
        name: 'numbers',
        description: 'Generates a random number(s)',
        options: [
          {
            type: 4, 
            name: 'num',
            description: 'The number of random numbers to generate',
            required: true
          },
          {
            type: 4, 
            name: 'min',
            description: 'The minimum number',
            required: true
          },
          {
            type: 4, 
            name: 'max',
            description: 'The maximum number',
            required: true
          },
          {
            type: 4, 
            name: 'base',
            description: 'The base (numeral system) to use for the number(s) [Default decimal (10)]',
            choices: [
              { name: 'hexadecimal', value: 16 },
              { name: 'decimal', value: 10 },
              { name: 'octal', value: 8 },
              { name: 'binary', value: 2 }
            ]
          }
        ]
      }
    ]
  },
  run: async (_client, interaction) => {
    await interaction.deferReply();
    const type = interaction.options.getSubcommand(),
      baseUrl = 'https://www.random.org/integers/?format=plain&rnd=new&';
    if (type === 'coinflip') {
      const num = await require('node-fetch')(`${baseUrl}num=1&min=0&max=10&col=1&base=10`).then(res => res.text());
      interaction.editReply(parseInt(num) % 2 === 0 ? 'Heads' : 'Tails');
    } else {
      const num = interaction.options.getInteger('num'),
        min = interaction.options.getInteger('min'),
        max = interaction.options.getInteger('max'),
        base = interaction.options.getInteger('base') || 10;
      const numbers = await require('node-fetch')(`${baseUrl}num=${num}&min=${min}&max=${max}&col=1&base=${base}`).then(res => res.text()),
        res = numbers.replace(/\n/g, '\t');
      if (res.length > 2000) {
        interaction.editReply({
          files: [
            {
              name: 'random.txt',
              attachment: Buffer.from(res)
            }
          ]
        })
      } else {
        interaction.editReply(res);
      }
    }
  }

};
