const executeCommand = require("../discord/commands");

async function handleMessageCreate(message) {
  if (message.author.bot) return;
  if (debugFlag) {
    console.log(message);
  }
  
  console.log(`発言者:${message.author.username}\nメッセージ:${message.content}`);

  await log(message);
    
  await executeCommand(message);
}

module.exports = handleMessageCreate;
