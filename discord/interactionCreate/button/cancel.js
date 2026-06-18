// 没(cancel)buttonが押された際に実行される

export async function cancelButton(interaction) {
  await interaction.reply("cancel");
  return;
}
