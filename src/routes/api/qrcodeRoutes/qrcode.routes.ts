import Router from "express";
import { qrcodeController } from "@/controllers/qrcodeControllers/qrcode.controller";

const router = Router();

router.get("/qrcode", qrcodeController);

export default router;
