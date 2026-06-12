const {
  REST,
  Routes,
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  Events,
  MessageFlags,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

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

client.once(Events.ClientReady, () => {
    console.log(`${client.user.tag} ready`);
});

const handleMessageCreate = require("../discord/messageCreate");
const handleInteractionCreate = require("../discord/interActionCreate");

client.on(Events.MessageCreate,　handleMessageCreate);
client.on(Events.InteractionCreate, handleInteractionCreate);

client.login(process.env.DISCORD_APITOKEN);
