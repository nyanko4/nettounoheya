const supabase = require("../supabase/client");

function getOmikujiResult() {
  const outcomes = [
      { rate: 5.0, result: "大凶" },
      { rate: 19.5, result: "小吉" },
      { rate: 20.0, result: "末吉" },
      { rate: 20.0, result: "吉" },
      { rate: 20.0, result: "中吉" },
      { rate: 7.0, result: "凶" },
      { rate: 0.5, result: "熱湯がなんでもする券(猫化系統以外)" }, 
      { rate: 0.5, result: "ぺいらがなんでもする券" },
      { rate: 0.5, result: "さばがなんでもする券" },
      { rate: 7.0, result: "大吉" },
  ];
  let random = Math.random() * 100;
  for (const { rate, result } of outcomes) {
    if (random < rate) return result;
    random -= rate;
  }
};

//おみくじ
async function omikuji(chatType, id) {
    try {
      const { data, error } = await supabase
        .from(`${chatType}Omikuji`)
        .select("id")
        .eq("id", id)
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
            id: id,
            result: omikujiResult,
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
    }
}

module.exports = omikuji;
