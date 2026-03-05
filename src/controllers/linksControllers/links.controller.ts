import { Request, Response } from "express";
import { Link, LinkModel } from "@/models/link.model";

export const getLinksController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado"
            });
        }
        const links = await LinkModel.getLinks(userId as number);
        res.json({ status: "success", code: 200, message: "Links obtenidos exitosamente", data: links, errors: null });
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
