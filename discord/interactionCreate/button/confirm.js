// 採用(confirm)buttonが押された際に実行される

import { client } from "../../client.js";
import { CONFIRM_ROOM_ID } from "../../config.js";

export async function confirmButton(interaction) {
  const channel = client.channels.cache.get(CONFIRM_ROOM_ID);
  await channel.send({ embeds: interaction.message.embeds });
  return;
}
