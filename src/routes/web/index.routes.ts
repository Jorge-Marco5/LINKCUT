import Router from "express";
import { dashboardController, qrcodeController, analyticsController, urlDetailsController, inactiveController, linksController, protectController } from "@/controllers/web/web.controller";
import authRoutes from "./auth/auth.routes";
import { authViewsMiddleware, optionalAuth } from "@/utils/authViews";

const router = Router();

router.get("/", optionalAuth, dashboardController);
router.get("/qrcode", authViewsMiddleware("user"), qrcodeController);
router.get("/analytics", authViewsMiddleware("user"), analyticsController);
router.get("/link", authViewsMiddleware("user"), linksController);
router.get("/link/:id", authViewsMiddleware("user"), urlDetailsController);
router.get("/inactive", inactiveController);
router.get("/protect", authViewsMiddleware("user"), protectController);

router.use("/auth", authRoutes);

export default router;