import {
  REST,
  Routes,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  PermissionFlagsBits,
  Events,
} from "discord.js";

import { client } from "../discord/client.js";

const slashCommands = [
  new SlashCommandBuilder()
    .setName("おみくじ")
    .setDescription("おみくじ"),
  new SlashCommandBuilder()
    .setName("nickname")
    .setDescription("ニックネームを変更")
    .addUserOption(option =>
      option
      .setName("target")
      .setDescription("ニックネームを変更する対象")
      .setRequired(true))
    .addStringOption((option) =>
      option
        .setName("change-nickname")
        .setDescription("変更する名前")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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
              .setDescription("機能の追加/改善案を書いてください"))),
  new SlashCommandBuilder()
    .setName("create-emoji")
    .setDescription("絵文字を作成")
    .addAttachmentOption((option) => 
      option
        .setName("emoji-image")
        .setDescription("作成する絵文字の画像")
        .setRequired(true))
    .addStringOption((option) =>
      option
        .setName("emoji-name")
        .setDescription('作成する絵文字の名前')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName("create-stamp")
    .setDescription("スタンプを作成")
    .addAttachmentOption((option) => 
      option
        .setName("stamp-image")
        .setDescription('作成するスタンプの画像')
        .setRequired(true))
    .addStringOption((option) =>
      option
        .setName("stamp-name")
        .setDescription("作成するスタンプの名前")
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName("捏造")
    .setDescription("ログを捏造")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("捏造内容")
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName("create-quote")
    .setDescription("引用を作成")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("メッセージ")
        .setRequired(true))
].map(cmd => cmd.toJSON());

const contextMenuCommands = [
  new ContextMenuCommandBuilder()
    .setName("message-edit")
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_APITOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.APP_ID),
      { body: [...slashCommands, ...contextMenuCommands] }
    );
    console.log("Slash commands and ContextMenu commands registered");
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
  handleMessageUpdate,
  handleMessageDelete
} from "../discord/modules/events.js";

client.on(Events.MessageCreate,　handleMessageCreate);
client.on(Events.InteractionCreate, handleInteractionCreate);
client.on(Events.MessageUpdate, handleMessageUpdate);
client.on(Events.MessageDelete, handleMessageDelete);

client.on('shardDisconnect', (event, shardId) => {
  console.log(
    `DISCONNECT shard=${shardId} code=${event.code} reason=${event.reason}`
  );
});

client.on('shardReconnecting', shardId => {
  console.log(`RECONNECTING shard=${shardId}`);
});

client.on('shardResume', shardId => {
  console.log(`RESUMED shard=${shardId}`);
});

client.login(process.env.DISCORD_APITOKEN);
