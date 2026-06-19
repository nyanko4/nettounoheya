import {
  REST,
  Routes,
  SlashCommandBuilder,
  Client,
  GatewayIntentBits,
  Events,
  Partials,
} from "discord.js";

export const client = new Client({
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
    .addSubcommand((subcommand) =>
      subcommand
        .setName("コマンド名")
        .setDescription("/の後に続くコマンド名を書いてください")
        .addStringOption((option) =>
          option
            .setName("コマンドの内容")
            .setDescription("実装してほしいコマンドの内容を書いてください")
            .setRequired(true)))
      .addSubcommand((subcommand) =>
        subcommand
          .setName("機能改善/追加")
          .setDescription("機能の改善/追加の要望を書いてください")
          .addStringOption((option) =>
            option
              .setName("概要")
              .setDescription("詳しく書ける場合は書いてください")))
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
