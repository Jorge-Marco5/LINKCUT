import { Request, Response } from "express";
import { LinkModel } from "@/models/link.model";
import { Click, ClickModel } from "@/models/click.model";
import geoip from "geoip-lite";

export const shortUrlController = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  try {
    const link = await LinkModel.shortUrl(shortUrl.toString());
    if (!link) {
      return res.redirect("/inactive?msg=Enlace no encontrado");
    }

    if (link.is_active === 0) {
      return res.redirect("/inactive?msg=El enlace que intentas acceder ha sido desactivado por su propietario.");
    }

    // Identificar país (IP logic)
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || "";
    const cleanIp = ip.split(',')[0].trim();
    const geo = geoip.lookup(cleanIp);
    const country = geo ? geo.country : "Unknown";

    await ClickModel.createClick(new Click(0, link.id, new Date().toISOString(), country));
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
