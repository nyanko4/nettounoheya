const axios = require("axios");
const reqcheck = require("../middleware/sign");
const commands = require("../module/commands");

async function getchat(req, res) {
  const c = await reqcheck(req);
  if (c !== "ok") {
    return res.sendStatus(400);
  }
  console.log(req.body);
  const {
    body,
    account_id: accountId,
    room_id: roomId,
    message_id: messageId,
  } = req.body.webhook_event;
  if (accountId == process.env.accountId) {
    return res.sendStatus(200);
  }
  await commands(body, messageId, roomId, accountId);
  res.sendStatus(200);
}

module.exports = getchat;
