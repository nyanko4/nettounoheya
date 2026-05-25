const { sendchatwork } = require("../ctr/message");
const omikuji = require("./omikuji");

async function commands(body, messageId, roomId, accountId) {
  let result = "";
  if (body.match(/^おみくじ$/)) {
    result = await omikuji("chatwork", accountId);
  }

  if (result.trim() !== "") {
    await sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${result}`, roomId);
  }
  
  return "ok";
}

module.exports = commands;
