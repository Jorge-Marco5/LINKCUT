import Router from "express";
import { dashboardController } from "@/controllers/web/web.controller";
import authRoutes from "./auth/auth.routes";
import { authMiddleware } from "@/utils/auth";

const router = Router();

router.get("/", authMiddleware("user"), dashboardController);
router.use("/auth", authRoutes);

export default router;