import { Request, Response } from "express";
import { getLinkService, clickService } from "@/services/link.service";

export const shortUrlController = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  try {
    const link = await getLinkService(shortUrl.toString());

    if (!link) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Enlace ${shortUrl} no encontrado`,
        data: null,
        errors: "Enlace no encontrado",
      });
    }

    await clickService(link.id);
    return res.redirect(link.url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Error al obtener el link",
      data: null,
      errors: error instanceof Error ? error.message : error,
    });
  }
};
