import { Request, Response } from "express";

export const qrcodeController = (req: Request, res: Response) => {
    res.json({ message: "Generar QRCode!" });
}