/*
https://zenn.dev/semapho/articles/063582c32eff32
*/


const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits, Events, MessageFlags } = require('discord.js');
const { omikuji } = require("../module/omikuji");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once(Events.ClientReady, () => {
    console.log(`${client.user.tag} ready`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  let result = "";
  console.log(message)
  if (message.content.match(/^おみくじ$/)) {
    result = await omikuji("discord", message.author.id);
  }

  if (result.trim() !== "") {
    message.reply(result);
  }
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
