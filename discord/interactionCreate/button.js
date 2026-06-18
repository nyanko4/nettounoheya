// buttonを制御する関数

import { confirmButton, cancelButton } from "../../modules/buttons.js";

const buttonFunction = {
  confirm: confirmButton,
  cancel: cancelButton,
}

export async function handleButton(interaction) {
  if (!interaction.customId) return;
  
  const handler = buttonFunction[interaction.customId];
  if (!handler) return;

  await handler(interaction)
}
