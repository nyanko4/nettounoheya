import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";
import { client } from "../../routes/discord.js";

import { REQUEST_ROOM_ID } from "../config.js";

const subcommands = {
  command: requestCommand,
  function: requestFunction
}

export async function requestBotFunction(interaction) {
  const subcommand = interaction.options.getSubcommand();
  if (!subcommand) return;

  const command = subcommands[subcommand];
  if (!command) return;

  const { embed, button } = await command(interaction);

  const channel = client.channels.cache.get(REQUEST_ROOM_ID);
  await channel.send({
    embeds: [embed],
    components: [button]
  });
  
  return "要望を送信しました";
}

async function requestCommand(interaction) {
  const requestCommandName = interaction.options.getString("command-name", true);
  const requestCommandInfo = interaction.options.getString("command-info", true);

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(interaction.user.username)
    .addFields({ name: "コマンド名", value: requestCommandName })
    .addFields({ name: "コマンド内容", value: requestCommandInfo })

  const button = await createButton()
  
  return { embed, button };
}

async function requestFunction(interaction) {
  const requestFunctionInfo = interaction.options.getString("function-info", true);
  
  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(interaction.user.username)
    .addFields({ name: "追加/改善案", value: requestFunctionInfo })

  const button = await createButton();
  
  return { embed, button };
}

async function createButton() {
  const confirmButton = new ButtonBuilder()
    .setCustomId("confirm")
    .setLabel("採用")
    .setStyle(ButtonStyle.Success);

  const cancelButton = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("没")
    .setStyle(ButtonStyle.Danger);

  const button = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

  return button;
}
