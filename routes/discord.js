import {
  REST,
  Routes,
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  Events,
  Partials,
} from "discord.js";

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

const slashCommands = [
  new SlashCommandBuilder()
    .setName("おみくじ")
    .setDescription("おみくじ"),
  new SlashCommandBuilder()
    .setName("要望")
    .setDescription("botの機能について要望できます")
    .addStringOption((option) =>
      option
        .setName("内容")
        .setDescription("botの要望したい機能を書いてください")
        .setRequired(true)),
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

client.once(Events.ClientReady, () => {
    console.log(`${client.user.tag} ready`);
});

import {
  handleMessageCreate,
  handleInteractionCreate,
  handleMessageUpdate
} from "../discord/modules/events.js";

client.on(Events.MessageCreate,　handleMessageCreate);
client.on(Events.InteractionCreate, handleInteractionCreate);
client.on(Events.MessageUpdate, handleMessageUpdate);

client.login(process.env.DISCORD_APITOKEN);
