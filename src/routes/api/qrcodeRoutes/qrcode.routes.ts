import { Router, Request, Response } from "express";
import { generateQRCodeController, getQRCodeController, registerQRCodeController, deleteQRCodeController, updateQRCodeController } from "@/controllers/qrcodeControllers/qrcode.controller";

const router = Router();

// listar los qr codes
router.get("/", getQRCodeController);

// crear un qr code
router.post("/generate", generateQRCodeController);

// registrar un texto para qr code
router.post("/", registerQRCodeController); 

// eliminar un qr code
router.delete("/:id", deleteQRCodeController);

// actualizar texto un qr code
router.put("/", updateQRCodeController);

export default router;
