import { Request, Response } from "express";
import { Link, LinkModel } from "@/models/link.model";
import { Click, ClickModel } from "@/models/click.model";
import geoip from "geoip-lite";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";

export const getLinksController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        if (!userId) {
            return res.status(401).json({
                status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado"
            });
        }
        const { getLink, total } = await LinkModel.getLinks(userId as number, page, limit, offset);
        res.json({
            status: "success",
            code: 200,
            message: "Links obtenidos exitosamente",
            data: {
                links: getLink,
                meta: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit)
                }
            },
            errors: null
        });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al obtener los links",
            data: null,
            errors: err.message
        });
    }
}

export const getLinkController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado"
            });
        }
        const link = await LinkModel.getLink(Number(id), userId as number);
        res.json({ status: "success", code: 200, message: "Link obtenido exitosamente", data: link, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al obtener el link",
            data: null,
            errors: err.message
        });
    }
}
/**
 * 
 * @param req url, alias, folder_id, is_protected, password, expires_at
 * @param res link[{id, url, short_url, is_protected, password, expires_at, alias, folder_id, user_id, created_at}]
 * @returns 
 */
export const postLinksController = async (req: Request, res: Response) => {
    try {
        const { url, expires_at } = req.body;
        // Validar que la URL ingresada sea válida; se utiliza un regex robusto que
        // soporta dominios, IPs, localhost, parámetros de query y previene ReDoS.
        const webRegex = /^(https?:\/\/)?(([\w.-]+\.[a-z]{2,6})|localhost|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d+)?(\/[^\s]*)?$/i;
        if (!webRegex.test(url)) {
            return res.status(400).json({
                status: "error", code: 400,
                message: "URL no valida",
                data: null,
                errors: "URL no valida"
            });
        }

        const shortUrl = Math.random().toString(36).substring(2, 10);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado"
            });
        }
        const createdAt = new Date().toISOString();
        const link = await LinkModel.createLink(new Link(0, url, shortUrl, userId, createdAt));
        res.json({ status: "success", code: 200, message: "Link creado exitosamente", data: link, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al crear el link",
            data: null,
            errors: err.message
        });
    }
}

export const deleteLinksController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const links = await LinkModel.deleteLink(Number(id));
        res.json({ status: "success", code: 200, message: "Link eliminado exitosamente", data: links, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al eliminar el link",
            data: null,
            errors: err.message
        });
    }
}


export const getStatsController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const stats = await LinkModel.statsUrl(Number(id));
        const text_description = "Enlace con un total de " + stats.reduce((acc: number, stat: any) => acc + stat.clicks, 0) + " clicks. "
        //agregar a stats la descripcion en forma de texto de lo que sucede con el enlace
        stats.forEach((stat: any) => {
            // Se le suma T12:00:00 para evitar que Node retrase un dia la fecha al castear DD-MM-YYYY
            const date = new Date(stat.day + 'T12:00:00');
            const day = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            stat.text_description = text_description + "El dia (" + day + ") tuvo " + stat.clicks + " clicks.";
        });
        res.json({ status: "success", code: 200, message: "Stats obtenidas exitosamente", data: stats, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al obtener las stats",
            data: null,
            errors: err.message
        });
    }
}

export const getStatsLocationsController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const locations = await LinkModel.statsLocations(Number(id));
        res.json({ status: "success", code: 200, message: "Ubicaciones obtenidas", data: locations, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al obtener las ubicaciones",
            data: null,
            errors: err.message
        });
    }
}

export const updateLinkController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { alias, password, expires_at } = req.body; //obtenemos datos del body opcionales

        // Handle Password Protection
        // Si el password viene vacío explícitamente (""), apagamos su protección.
        // Si no es un string vacío y viene definido, la aplicamos.
        if (password !== "" && password !== undefined) {
            if (password.trim() === "") {
                await LinkModel.unprotectLink(Number(id));
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                await LinkModel.protectLink(Number(id), hashPassword);
            }
        }

        // Handle Expiration Date
        if (expires_at !== undefined && expires_at !== "") {
            if (expires_at.trim() === "") {
                await LinkModel.removeExpiresAt(Number(id));
            } else {
                await LinkModel.setExpiresAt(Number(id), expires_at);
            }
        }

        // Handle Alias
        if (alias !== undefined && alias !== "") {
            const aliasExists = await LinkModel.verifyAlias(alias);
            if (aliasExists) {
                return res.status(400).json({
                    status: "error", code: 400,
                    message: "El alias ya existe, intente con otro.",
                    data: null,
                    errors: "El alias ya existe"
                });
            }
            await LinkModel.setAlias(Number(id), alias);
        }

        res.json({ status: "success", code: 200, message: "Link actualizado exitosamente" });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al actualizar el link",
            data: null,
            errors: err.message
        });
    }
}

/**
 * Verifica la contraseña de un link
 * @param req 
 * @param res 
 * @returns 
 */
export const protectLinkController = async (req: Request, res: Response) => {
    try {
        const { short_url } = req.query;
        const { password } = req.body;
        const passwordHash = await LinkModel.verifyPassword(short_url as string);

        //comparar contraseña hash con la ingresada
        const isPasswordValid = await bcrypt.compare(password, passwordHash.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: "error", code: 400,
                message: "Contraseña incorrecta",
                data: null,
                errors: "Contraseña incorrecta"
            });
        }
        //buscar el enlace al que redirige
        const link = await LinkModel.getLinkByShortUrl(short_url as string);
        if (!link) {
            return res.status(404).json({
                status: "error", code: 404,
                message: "Enlace no encontrado",
                data: null,
                errors: "Enlace no encontrado"
            });
        }

        // Identificar país (IP logic)
        const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || "";
        const cleanIp = ip.split(',')[0].trim();
        const geo = geoip.lookup(cleanIp);
        const country = geo ? geo.country : "Unknown";

        await ClickModel.createClick(new Click(0, link.id, new Date().toISOString(), country));

        res.json({ status: "success", code: 200, message: "Link protegido exitosamente", data: link?.url, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error en la protección del link",
            data: null,
            errors: err.message
        });
    }
}

export const toggleLinkStatusController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await LinkModel.toggleStatus(Number(id), is_active);
        res.json({ status: "success", code: 200, message: "Estado de la URL actualizado", data: { is_active }, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al actualizar el estado de la URL",
            data: null,
            errors: err.message
        });
    }
}

export const unprotectLinkController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await LinkModel.unprotectLink(Number(id));
        res.json({ status: "success", code: 200, message: "Enlace desprotegido", data: null, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al desproteger el enlace",
            data: null,
            errors: err.message
        });
    }
}

export const removeExpirationController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await LinkModel.removeExpiresAt(Number(id));
        res.json({ status: "success", code: 200, message: "Expiración eliminada", data: null, errors: null });
    } catch (err: any) {
        res.status(500).json({
            status: "error", code: 500,
            message: "Error al eliminar fecha de expiración",
            data: null,
            errors: err.message
        });
    }
}
