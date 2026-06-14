import { MessageFlags } from "discord.js";
import { omikuji, requestBotFunction } from "../discord/modules/commands.js";

export async function handleInteractionCreate(interaction) {
  if (!interaction.isChatInputCommand()) return;
  
  let result = "";
  
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  });
  
  if (interaction.commandName == "おみくじ") {
    result = await omikuji(interaction, "discord");
  }
  if (interaction.commandName == "要望") {
    result = await requestBotFunction(interaction);
  }
  
  await interaction.editReply({ content: result });
}
