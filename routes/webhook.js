import express from "express";
const router = express.Router();

import { mentionWebhook } from "../chatwork/webhook/mention.js";
import { getchatWebhook } from "../chatwork/webhook/getchat.js";

router.post("/mention", mentionWebhook);
router.post("/getchat", getchatWebhook);

export default router;
