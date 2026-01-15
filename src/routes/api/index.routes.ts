import Router from "express";
import linkRoutes from "@/routes/api/linksRoutes/link.routes";
import qrcodeRoutes from "@/routes/api/qrcodeRoutes/qrcode.routes";
import { authMiddleware } from "@/utils/auth";
import authRoutes from "@/routes/api/auth/auth.routes";

const router = Router();

router.get("/", authMiddleware("user"), (req, res) => {
    res.send("Hello World!");
});

router.use("/auth", authRoutes);

router.use("/link", authMiddleware("user"), linkRoutes);
router.use("/stats", authMiddleware("user"), linkRoutes);
router.use("/qrcode", authMiddleware("user"), qrcodeRoutes);

export default router;
