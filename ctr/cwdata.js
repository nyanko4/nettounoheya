import axios from "axios";

const CHATWORK_API_TOKEN = process.env.CWapitoken;

export async function isUserAdmin(accountId, roomId) {
  try {
    const response = await axios.get(
      `https://api.chatwork.com/v2/rooms/${roomId}/members`,
      {
        headers: {
          accept: "application/json",
          "X-ChatWorkToken": CHATWORK_API_TOKEN,
        },
      }
    );
    const member = response.data.find((m) => m.account_id === accountId);
    if (member && member.role === "admin") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("isUserAdminError:", error.response?.data || error.message);
    return false;
  }
}
