import { logger } from "../modules/utils/messageLogger.js";

export async function handleMessageUpdate(oldMessage, newMessage) {
  if (newMessage.partial) {
      await newMessage.fetch();
    }
  
  await logger(newMessage, oldMessage);
}
