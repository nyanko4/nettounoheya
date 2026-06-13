import { logger, executeCommand } from "../modules/commands";

export async function handleMessageCreate(message) {
  if (message.author.bot) return;
  if (debugFlag) {
    console.log(message);
  }
  
  console.log(`発言者:${message.author.username}\nメッセージ:${message.content}`);

  await logger(message);
    
  await executeCommand(message);
}
