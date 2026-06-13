import { readMessage, deleteMessages, sendMessage } from "../ctr/message.js";
import { isUserAdmin } from "../ctr/cwdata.js";


export async function mentionWebhook(req, res) {
  const {
    body,
    from_account_id: accountId,
    room_id: roomId,
    message_id: messageId,
  } = req.body.webhook_event;
  
  await readmessage(roomId, messageId);
  
  if (body.includes("削除")) {
    const isAdmin = await isUserAdmin(accountId, roomId);
    if (!isAdmin) return await sendMessage("管理者のみ利用可能です", roomId, "chatwork");
    
    await deleteMessages(body, messageId, roomId, accountId, "chatwork");
    return res.sendStatus(200);
  }
  
  return "ok";
}
