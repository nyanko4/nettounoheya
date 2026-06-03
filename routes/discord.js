/*
参考資料
https://discord.js.org/docs/packages/discord.js/14.26.4/Client:Class#on
*/

// log関数整備　ファイル対応


const { REST, Routes, SlashCommandBuilder, Client, GatewayIntentBits, Events, MessageFlags, Partials, EmbedBuilder } = require('discord.js');
const omikuji = require("../module/omikuji");
const { DateTime } = require("luxon");
const LOG_PERSON_ID = process.env.LOG_PERSON_ID;
const LOG_ROOM_ID = process.env.LOG_ROOM_ID;
const BOT_OWNER_ID = process.env.BOT_OWNER_ID;
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
  おみくじ: omikuji,
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
    
  let result = null;
  for (const command in commands) {
    if (message.content == command) {
      result = await commands[command](message, "discord");
      break;
    }
  }

  if (result) {
    await message.reply(result);
  }
})

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
  if (newMessage.partial) {
    await newMessage.fetch();
  }
  await log(newMessage, oldMessage);
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
    result = await omikuji(interaction, "discord");
  }
  await interaction.editReply({ content: result });
})

async function log(message, oldMessage = null) {
  if (!message.author) return;
  if (
    message.author.id != LOG_PERSON_ID ||
    message.channelId == LOG_ROOM_ID
  ) return;
  
  const embed = new EmbedBuilder()
  .setColor(0x00ff00)
  .setTitle(message.author.username)
  .addFields({ name: "messageLink", value: `[元のメッセージ](${message.url})` })

   const toJST = (ms) =>
     DateTime.fromMillis(ms, { zone: "Asia/Tokyo" }).toFormat("yyyy/MM/dd HH:mm:ss");

  if (oldMessage) {
    embed.addFields(
      { name: "編集前コメント", value: oldMessage.content },
      { name: "時刻", value: toJST(oldMessage.createdTimestamp) }
    )
  }

  embed.addFields(
    { name: "内容", value: message.content },
    { name: "時刻", value: toJST(message.editedTimestamp || message.createdTimestamp) }
  )
  
  const attachments = message.attachments.map(
  attachment => attachment.proxyURL
  );
  
  embed.addFields({
    name: "添付ファイル",
    value: attachments.join("\n") || "なし"
  });
  
  const channel = client.channels.cache.get(LOG_ROOM_ID);
  await channel.send({ embeds: [embed] });
}

async function debug(message) {
  if (message.author.id != BOT_OWNER_ID) return;
  debugFlag = !debugFlag;
  return `デバッグモードを${debugFlag ? "ON" : "OFF"}にしました`;
}

client.login(process.env.DISCORD_APITOKEN);
