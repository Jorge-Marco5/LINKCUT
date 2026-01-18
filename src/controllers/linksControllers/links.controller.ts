import { Request, Response } from "express";
import { Link, LinkModel } from "@/models/link.model";

export const getLinksController = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado" });
        }
        const links = await LinkModel.getLinks(userId as number);
        res.json({status: "success", code: 200, message: "Links obtenidos exitosamente", data: links, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al obtener los links",
            data: null,
            errors: err.message });
    }
}
/**
 * 
 * @param req url, alias, folder_id, is_protected, password, expires_at
 * @param res link[{id, url, short_url, is_protected, password, expires_at, alias, folder_id, user_id, created_at}]
 * @returns 
 */
export const postLinksController = async (req: Request, res: Response) => {
    try{
        const { url, expires_at } = req.body;
        //validar que la url sea valida
        const webRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,6})+([\/\w\-.?=&]*)*\/?$/;
        if(!webRegex.test(url)){
            return res.status(400).json({ status: "error", code: 400,
                message: "URL no valida",
                data: null,
                errors: "URL no valida" });
        }

        const shortUrl = Math.random().toString(36).substring(2, 10);
        const userId = req.user?.id;
        if(!userId){
            return res.status(401).json({ status: "error", code: 401,
                message: "No autenticado",
                data: null,
                errors: "No autenticado" });
        }
        const createdAt = new Date().toISOString();
        const link = await LinkModel.createLink(new Link(0, url, shortUrl, userId, createdAt));
        res.json({status: "success", code: 200, message: "Link creado exitosamente", data: link, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al crear el link",
            data: null,
            errors: err.message });
    }
}

export const deleteLinksController = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const links = await LinkModel.deleteLink(Number(id));
        res.json({status: "success", code: 200, message: "Link eliminado exitosamente", data: links, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al eliminar el link",
            data: null,
            errors: err.message });
    }
}


export const getStatsController = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const stats = await LinkModel.statsUrl(Number(id));
        res.json({status: "success", code: 200, message: "Stats obtenidas exitosamente", data: stats, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al obtener las stats",
            data: null,
            errors: err.message });
    }
}
