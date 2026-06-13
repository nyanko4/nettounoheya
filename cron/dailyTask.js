import { CronJob } from "cron";
import { supabase } from "../supabase/client.js";

export function startDailyTask() {
  new CronJob(
    "0 0 0 * * *",
    async () => {
      await supabase.from("chatworkOmikuji").delete().neq("id", 0)
      await supabase.from("discordOmikuji").delete().neq("id", 0)
    },
    null,
    true,
    "Asia/Tokyo"
  );
}
