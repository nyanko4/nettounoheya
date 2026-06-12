import express from "express";
const app = express();

import webhookRouter from "./routes/webhook"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", webhookRouter);
app.get('/send', (req, res) => {
  res.end(JSON.stringify(process.versions, null, 2));
  console.log("ぬ")
});

app.listen(3000, () => {
  console.log(`${process.pid} started`);
});
