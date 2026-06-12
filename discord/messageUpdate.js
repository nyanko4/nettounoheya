const logger = require("../discord/messageLogger");

async function handleMessageUpdate(oldMessage, newMessage) {
  if (newMessage.partial) {
      await newMessage.fetch();
    }
  
  await logger(newMessage, oldMessage);
}

module.exports = handleMessageUpdate;
