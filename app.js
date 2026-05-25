"use strict";
const startDailyTask = require("./cron/dailyTask");
  startDailyTask();
  require("./server");
  require("./routes/discord");
