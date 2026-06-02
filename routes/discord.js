/*
参考資料
https://discord.js.org/docs/packages/discord.js/14.26.4/Client:Class#on
*/

// log関数整備　ファイル対応


const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits, Events, MessageFlags, Partials } = require('discord.js');
const LOG_PERSON_ID = process.env.LOG_PERSON_ID;
const LOG_ROOM_ID = process.env.LOG_ROOM_ID;
const BOT_OWNER = process.env.BOT_OWNER;
let debugFlag = false;

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
  debug: debug,
}

client.once(Events.ClientReady, () => {
    console.log(`${client.user.tag} ready`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (debugFlag) {
    console.log(message);
  }

  console.log(`発言者:${message.author.username}\nメッセージ:${message.content}`);
  await log(message);
    
  let result = "";
  for (command in commands) {
    if (message.content == command) {
      result = await commands[command](message, "discord");
      break;
    }
  }

  if (result.trim() !== "") {
    await message.reply(result);
  }
})

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  await log(newMessage);
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

async function log(message) {
    if (message.author.id == LOG_PERSON_ID && message.channelId != LOG_ROOM_ID) {
      const embed = new EmbedBuilder()
      .addField({ name: message.author.username, value: message.content })
      .setColor(0x00ff00)
      .setTimestamp(message.createdTimestamp)
      const channel = client.channels.cache.get(LOG_ROOM_ID);
      await channel.send({ embeds: [embed] });
  }
}

async function debug(message) {
  if (message.author.id != BOT_OWNER) return;
  debugFlag = !debugFlag;
  message.reply(`デバッグモードを${debugFlag ? "ON" : "OFF"}にしました`);
}

client.login(process.env.DISCORD_APITOKEN);
