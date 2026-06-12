const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

async function requestBotFunction(interaction) {
  const requestInfo = interaction.options.getString("内容", true);

  const embed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle(interaction.user.username)
    .addFields({ name: "要望内容", value: requestInfo })

  const confirmButton = new ButtonBuilder()
    .setCustomId("confirm")
    .setLabel("採用")
    .setStyle(ButtonStyle.Success);

  const cancelButton = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("没")
    .setStyle(ButtonStyle.Danger);

  const buttons = new ActionRowBuilder().addComponents(confirmButton, cancelButton);
  
  const channel = client.channels.cache.get(REQUEST_ROOM_ID);
  await channel.send({ embeds: [embed], components: [buttons] });
  return "要望を送信しました";
}
