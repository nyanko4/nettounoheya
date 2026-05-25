/*
https://zenn.dev/semapho/articles/063582c32eff32
*/


const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits, Events, MessageFlags } = require('discord.js');
const { omikuji } = require("../module/omikuji");
let result = "";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.clientReady, () => {
    console.log(`${client.user.tag} ready`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  console.log(message)
  if (message.content.match(/^おみくじ$/)) {
    result = await omikuji("discord", message.user.id);
  }
  message.reply(result);
})


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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });
  if (interaction.commandName == 'おみくじ') {
    result = await omikuji("discord", interaction.user.id);
  }
  await interaction.editReply({ content: result });
})

