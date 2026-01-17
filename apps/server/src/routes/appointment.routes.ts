import { Router } from "express";
import { getAppointments, getDashboardStats } from "../controllers/appointment.controller";

const router: Router = Router();

router.get("/", getAppointments);
router.get("/stats", getDashboardStats);

export default router;
