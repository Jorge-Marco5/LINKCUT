import { Request, Response } from "express";
import { LinkModel } from "@/models/link.model";
import { Click, ClickModel } from "@/models/click.model";


export const shortUrlController = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  try {
    const link = await LinkModel.shortUrl(shortUrl.toString());
    if (!link) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: `Enlace ${shortUrl} no encontrado`,
        data: null,
        errors: "Enlace no encontrado",
      });
    }

    await ClickModel.createClick(new Click(0, link.id, new Date().toISOString()));
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
