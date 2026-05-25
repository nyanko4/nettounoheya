const { sendchatwork } = require("../ctr/message");
let result = "";

module.exports = async (body, messageId, roomId, accountId) => {
  if (body.match(/^おみくじ$/)) {
    result = await omikuji("chatwork", accountId);
  }

  if (result.trim() !== "") {
    await sendchatwork(`[aid=${accountId} to=${roomId}-${messageId}][pname:${accountId}]さん\n${result}`);
  }
  
  return "ok";
}
