// 採用(confirm)buttonが押された際に実行される

export async function confirmButton(interaction) {
  await interaction.reply("confirm");
  return;
}
