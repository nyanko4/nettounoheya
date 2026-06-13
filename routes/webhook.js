import express from "express";
const router = express.Router();

import { mentionWebhook } from "../webhook/mention.js";
import { getchatWebhook } from "../webhook/getchat.js";

router.post("/mention", async (req, res) => {
  await mentionWebhook(req, res);
});

router.post("/getchat", async (req, res) => {
  await getchatWebhook(req, res);
});

export default router;
