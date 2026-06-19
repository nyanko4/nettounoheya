// 採用(confirm)buttonが押された際に実行される

import { client } from "../../client.js";

export async function confirmButton(interaction) {
  await interaction.reply("confirm");
  const message = await interaction.channel.message.fetch(interaction.message.id);
  console.log(message);
  console.log(interaction);
  console.log(interaction.context);
  return;
}
