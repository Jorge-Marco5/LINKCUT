import { Router, Request, Response } from "express";
import { postQRCodeController } from "@/controllers/qrcodeControllers/qrcode.controller";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "QR Code Generator" });
});

router.post("/", postQRCodeController);

export default router;
