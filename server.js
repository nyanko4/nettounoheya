const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/webhook"));
app.use("/", require("./routes/discord"));
app.get('/send', (req, res) => {
  res.end(JSON.stringify(process.versions, null, 2));
  console.log("ぬ")
});

app.listen(3000, () => {
  console.log(`${process.pid} started`);
});
