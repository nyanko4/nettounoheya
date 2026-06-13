import { omikuji, debug } from "../modules/commands.js";

const commands = {
  おみくじ: omikuji,
  debug: debug,
}

export async function executeCommand(message) {
  const command = commands[message.content];

  if (!command) return;

  try {
    const result = await command(message, "discord");
    await message.reply(result);
  } catch (error) {
    console.error("executeCommandError", error.response?.data || error.message);
    await message.reply("エラーが発生しました。");
  }
}
