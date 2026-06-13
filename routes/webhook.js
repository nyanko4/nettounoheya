import express from "express";
const router = express.Router();

import { mentionWebhook } from "../webhook/mention.js";
import { getchatWebhook } from "../webhook/getchat.js";

router.post("/mention", mentionWebhook);
router.post("/getchat", getchatWebhook);

export default router;
