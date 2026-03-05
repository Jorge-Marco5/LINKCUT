import Router from "express";
import { dashboardController, qrcodeController, analyticsController, urlDetailsController, inactiveController } from "@/controllers/web/web.controller";
import authRoutes from "./auth/auth.routes";
import { authMiddleware } from "@/utils/auth";

const router = Router();

router.get("/", authMiddleware("user"), dashboardController);
router.get("/qrcode", authMiddleware("user"), qrcodeController);
router.get("/analytics", authMiddleware("user"), analyticsController);
router.get("/link/:id", authMiddleware("user"), urlDetailsController);
router.get("/inactive", inactiveController);

router.use("/auth", authRoutes);

export default router;