import { BOT_OWNER_ID } from "../discord/config.js";
let debugFlag = false;

export async function debug(message) {
  if (message.author.id != BOT_OWNER_ID) return;
  debugFlag = !debugFlag;
  return `デバッグモードを${debugFlag ? "ON" : "OFF"}にしました`;
}
