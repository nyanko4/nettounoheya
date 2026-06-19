// 採用(confirm)buttonが押された際に実行される

import { CONFIRM_ROOM_ID } from "../../config.js";

export async function confirmButton(interaction) {
  const message = interaction.message.embeds;
  console.log(message);
  return;
}
