const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits, Events, MessageFlags, Partials } = require('discord.js');

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent
    ],
  partials: [
    Partials.Message,
    Partials.Channel
  ]
});

const commands = {
  おみくじ: require("../module/omikuji"),
}

client.once(Events.ClientReady, () => {
    console.log(`${client.user.tag} ready`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  console.log(`発言者:${message.author.username}\nメッセージ:${message.content}`);
  if (message.author.id == process.env.LOG_PERSON_ID) {
    const channel = client.channel.cache.get(process.env.LOG_ROOM_ID);
    await channel.send(`> ${message.content}`);
  }
  let result = "";
  for (command in commands) {
    if (message.content == command) {
      result = await commands[command]("discord", message.author.id);
    }
  }

  if (result.trim() !== "") {
    message.reply(result);
  }
})


const slashCommands = [
  new SlashCommandBuilder()
    .setName('おみくじ')
    .setDescription('おみくじ'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APITOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: slashCommands }
    );
    console.log("Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  let result = "";
  
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });
  if (interaction.commandName == 'おみくじ') {
    result = await omikuji("discord", interaction.user.id);
  }
  await interaction.editReply({ content: result });
})

client.login(process.env.DISCORD_APITOKEN);
