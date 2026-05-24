// 凶から3%移動させる

const supabase = require("../supabase/client");
const { sendchatwork } = require("../ctr/message");

function getOmikujiResult() {
  const outcomes = [
      { rate: 5.0, result: "大凶" },
      { rate: 20.0, result: "小吉" },
      { rate: 20.0, result: "末吉" },
      { rate: 20.0, result: "吉" },
      { rate: 20.0, result: "中吉" },
      { rate: 10.0, result: "凶" },
      { rate: 0.5, result: "熱湯がなんでもする券(猫化系統以外)" },
      { rate: 4.5, result: "大吉" }
  ];
  let random = Math.random() * 100;
  for (const { rate, result } of outcomes) {
    if (random < rate) return result;
    random -= rate;
  }
};

//おみくじ
async function omikuji(body, messageId, roomId, accountId) {
  if (!body.match(/^おみくじ$/)) return;
    try {
      const { data, error } = await supabase
        .from("omikuji")
        .select("account_id")
        .eq("account_id", accountId)
        .single();

      if (error) {
        console.error("Supabaseエラー:", error);
      }

      if (data) return;
      
      const omikujiResult = getOmikujiResult();
      const { data: insertData, error: insertError } = await supabase
        .from("omikuji")
        .insert([
          {
            account_id: accountId,
            result: omikujiResult,
          },
        ]);
      
      console.log(insertData)
      
      if (insertData === null) await sendchatwork(`[rp aid=${accountId} to=${roomId}-${messageId}]\n${omikujiResult}`, roomId);
      
      if (insertError) {
        console.error("Supabase保存エラー:", insertError);
      } else {
        console.log("おみくじ結果が保存されました:", insertData);
      }
      
    } catch (error) {
      console.error("omikujiError:", error.response?.data || error.message);
    }
}

module.exports = omikuji;
