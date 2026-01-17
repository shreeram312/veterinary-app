import { Router } from "express";
import { createSession } from "../controllers/session.controller";

const router:Router = Router();

router.post("/create", createSession);

export default router;
