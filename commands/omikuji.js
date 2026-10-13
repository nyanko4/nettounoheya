import { supabase } from "../supabase/client.js";

function getOmikujiResult() {
  const outcomes = [
    { rate: 5.0, result: "大凶" },
    { rate: 19.5, result: "小吉" },
    { rate: 20.0, result: "末吉" },
    { rate: 20.0, result: "吉" },
    { rate: 20.0, result: "中吉" },
    { rate: 7.0, result: "凶" },
    { rate: 1.3, result: "大大吉" }, 
    { rate: 0.2, result: " 大大大吉（勝利の化身があなたに微笑みかけることであろう）"},
    { rate: 7.0, result: "大吉" }
  ];
  let random = Math.random() * 100;
  for (const { rate, result } of outcomes) {
    if (random < rate) return result;
    random -= rate;
  }
};

function getId(chatType, data) {
  if (chatType === "discord") return {
    userId: data.author?.id ?? data.user?.id,
    serverId: data.guildId
    };
  

  return {
    userId: data.accountId,
    serverId: data.roomId
  };
}

//おみくじ
export async function omikuji(chatData, chatType) {
    try {
      const { userId, serverId } = getId(chatType, chatData);
      const { data, error } = await supabase
        .from(`${chatType}Omikuji`)
        .select("id")
        .eq("id", userId)
        .eq("serverId", serverId)
        .single();

      if (error) {
        console.error("Supabaseエラー:", error);
      }

      if (data) return "おみくじは1日1回までです";
      
      const omikujiResult = getOmikujiResult();
      const { data: insertData, error: insertError } = await supabase
        .from(`${chatType}Omikuji`)
        .insert([
          {
            id: userId,
            result: omikujiResult,
            serverId: serverId
          },
        ]);
      
      console.log(insertData)
      
      if (insertData === null) return omikujiResult;
      
      if (insertError) {
        console.error("Supabase保存エラー:", insertError);
      } else {
        console.log("おみくじ結果が保存されました:", insertData);
      }
      
    } catch (error) {
      console.error("omikujiError:", error.response?.data || error.message);
      console.log(user);
      return "エラーが発生しました。";
    }
}
