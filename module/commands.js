const { sendchatwork } = require("../ctr/message");
let result = "";

async function commands(body, messageId, roomId, accountId) => {
  if (body.match(/^おみくじ$/)) {
    result = await omikuji("chatwork", accountId);
  }

  if (result.trim() !== "") {
    await sendchatwork(`[aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${result}`);
  }
  
  return "ok";
}

module.exports = commands;
