import { Request, Response } from "express";
import QRCode from "qrcode";
import { TextQR, TextQRModel } from "@/models/textqr.model";

/**
 * Genera un código QR sin registrar en la base de datos
 * @param req 
 * @param res 
 * @returns 
 */
export const generateQRCodeController = async (req: Request, res: Response) => {
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

/**
 * Lista los textos de los qr codes de usuario logueado
 * @param req
 * @param res
 * @returns
 */
export const getQRCodeController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado" });
        }

        const list = await TextQRModel.getAll(Number(userId));
        res.json({ 
            status: "success", 
            code: 200, 
            message: "Listado de textos de QRs exitoso", 
            data: list, 
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

/**
 * Registra un texto para un qr code, se guarda en la base de datos el texto y el usuario que lo registro
 * @param req
 * @param res
 * @returns
 */
export const registerQRCodeController = async (req: Request, res: Response) => {
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
        
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado" });
        }

        await TextQRModel.create(text, Number(userId));

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

/**
 * Elimina un texto de un qr code, se elimina de la base de datos el texto y el usuario que lo registro
 * @param req
 * @param res
 * @returns
 */
export const deleteQRCodeController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ 
                status: "error",
                code: 400,
                message: "Se requiere el campo id",
                data: null,
                errors: "Se requiere el campo id"
            });
        }
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado" });
        }
        await TextQRModel.delete(Number(id), Number(userId));
        res.json({ 
            status: "success", 
            code: 200, 
            message: "QR eliminado exitosamente", 
            data: null, 
            errors: null 
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: "error", 
            code: 500, 
            message: "Error eliminando el código QR", 
            data: null, 
            errors: error.message 
        });
    }
}

/**
 * Actualiza un texto de un qr code, se actualiza en la base de datos el texto y el usuario que lo registro
 * @param req
 * @param res
 * @returns
 */
export const updateQRCodeController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ 
                status: "error",
                code: 400,
                message: "Se requiere el campo id",
                data: null,
                errors: "Se requiere el campo id"
            });
        }
        const userId = req.params.userId;
        if(userId){
            throw new Error("Usuario no autenticado");
        }
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
        await TextQRModel.update(Number(id), text, Number(userId));
        res.json({ 
            status: "success", 
            code: 200, 
            message: "QR actualizado exitosamente", 
            data: null, 
            errors: null 
        });
    } catch (error: any) {
        res.status(500).json({ 
            status: "error", 
            code: 500, 
            message: "Error actualizando el código QR", 
            data: null, 
            errors: error.message 
        });
    }
}
