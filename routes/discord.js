import {
  REST,
  Routes,
  SlashCommandBuilder,
  Events,
} from "discord.js";

import { client } from "../discord/client.js";

const slashCommands = [
  new SlashCommandBuilder()
    .setName("おみくじ")
    .setDescription("おみくじ"),
  new SlashCommandBuilder()
    .setName("要望")
    .setDescription("botの機能について要望できます")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("command")
        .setDescription("スラッシュコマンドの要望")
        .addStringOption((option) =>
          option
            .setName("command-name")
            .setDescription("/の後に続くコマンド名を書いてください")
            .setRequired(true))
        .addStringOption((option) =>
          option
            .setName("command-info")
            .setDescription("実装してほしいコマンドの内容を書いてください")
            .setRequired(true)))
      .addSubcommand((subcommand) =>
        subcommand
          .setName("function")
          .setDescription("機能の追加/改善")
          .addStringOption((option) =>
            option
              .setName("function-info")
              .setDescription("機能の追加/改善案を書いてください")))
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
