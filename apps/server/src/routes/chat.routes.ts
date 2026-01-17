import { Router } from "express";
import { chat, getChatHistory } from "../controllers/chat.controller";

const router:Router = Router();

router.post("/", chat);
router.get("/history/:sessionId", getChatHistory);

export default router;
