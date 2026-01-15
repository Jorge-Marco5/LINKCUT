import { Request, Response } from "express";
import QRCode from "qrcode";

export const postQRCodeController = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ 
                status: "error",
                code: 400,
                message: "Se requiere el campo text",
                data: null,
                errors: "Se requiere el campo text"
            });
        }

        const qrDataUrl = await QRCode.toDataURL(text);
        res.json({ 
            status: "success", 
            code: 200, 
            message: "QR generado exitosamente", 
            data: { qr: qrDataUrl }, 
            errors: null 
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: "error", 
            code: 500, 
            message: "Error generando el código QR", 
            data: null, 
            errors: error.message 
        });
    }
}