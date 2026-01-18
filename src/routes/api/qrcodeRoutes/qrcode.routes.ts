import { Router, Request, Response } from "express";
import { generateQRCodeController, getQRCodeController, registerQRCodeController, deleteQRCodeController, updateQRCodeController } from "@/controllers/qrcodeControllers/qrcode.controller";
import { authMiddleware } from "@/utils/auth";
import { idValidator, textValidator } from "@/utils/validator";
const router = Router();

// listar los qr codes
router.get("/", authMiddleware("user"), getQRCodeController);

// crear un qr code
router.post("/generate", authMiddleware("user"), textValidator, generateQRCodeController);

// registrar un texto para qr code
router.post("/", authMiddleware("user"), textValidator, registerQRCodeController); 

// eliminar un qr code
router.delete("/:id", authMiddleware("user"), idValidator, deleteQRCodeController);

// actualizar texto un qr code
router.put("/", authMiddleware("user"), idValidator, textValidator, updateQRCodeController);

export default router;
