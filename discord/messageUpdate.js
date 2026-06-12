const {
  logger
} = require("../modules/utils");

async function handleMessageUpdate(oldMessage, newMessage) {
  if (newMessage.partial) {
      await newMessage.fetch();
    }
  
  await logger(newMessage, oldMessage);
}

module.exports = handleMessageUpdate;
