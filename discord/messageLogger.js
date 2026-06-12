const {
  EmbedBuilder
} = require('discord.js');

const {
  LOG_PERSON_ID,
  LOG_ROOM_ID
} = require("../discord/config.json");

const { DateTime } = require("luxon");

async function logger(message, oldMessage = null) {
  if (!message.author) return;
  if (
    message.author.id != LOG_PERSON_ID ||
    message.channelId == LOG_ROOM_ID
  ) return;
  
  const embed = new EmbedBuilder()
  .setColor(0x00ff00)
  .setTitle(message.author.username)
  .addFields({ name: "messageLink", value: `[元のメッセージ](${message.url})` })

   const toJST = (ms) =>
     DateTime.fromMillis(ms, { zone: "Asia/Tokyo" }).toFormat("yyyy/MM/dd HH:mm:ss");

  if (oldMessage) {
    embed.addFields(
      { name: "編集前コメント", value: oldMessage.content },
      { name: "時刻", value: toJST(oldMessage.createdTimestamp) }
    )
  }

  embed.addFields(
    { name: "内容", value: message.content },
    { name: "時刻", value: toJST(message.editedTimestamp || message.createdTimestamp) }
  )
  
  if (message.attachments.size > 0) {
    embed.addFields({
      name: "添付ファイル",
      value: message.attachments.map(a => a.proxyURL).join("\n")
    });
  }

  const stickerId = message.stickers.first()?.id;
  if (stickerId) {
    const sticker = await client.fetchSticker(stickerId);
    embed.addFields({
      name: "スタンプ",
      value: sticker.url
    })
  }
  
  const channel = client.channels.cache.get(LOG_ROOM_ID);
  await channel.send({ embeds: [embed] });
}
