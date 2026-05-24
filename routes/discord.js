const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const { omikuji } = require("../module/omikuji");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


const commands = [
  new SlashCommandBuilder()
    .setName('おみくじ')
    .setDescription('おみくじ'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APITOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: commands }
    );
    console.log("Slash commands registered");
  } catch (err) {
    console.error(err);
  }
})();

rest.put(
  Routes.applicationCommands(process.env.APP_ID),
  { body: commands }
);

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  let result = "";

  await interaction.deferReply();
  if (interaction.commandName == 'おみくじ') {
    result = await omikuji("discord", interaction.user.id);
  }

  interactin.editReply(result);
})
