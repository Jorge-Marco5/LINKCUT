import { Request, Response } from "express";
import { getLinksService, postLinksService, deleteLinksService, statsService } from "@/services/link.service";

export const getLinksController = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;
        const links = await getLinksService(userId as number);
        res.json({status: "success", code: 200, message: "Links obtenidos exitosamente", data: links, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al obtener los links",
            data: null,
            errors: err.message });
    }
}

export const postLinksController = async (req: Request, res: Response) => {
    try{
        const { url } = req.body;
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
        const createdAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const links = await postLinksService(url, shortUrl, userId as number, createdAt);
        res.json({status: "success", code: 200, message: "Link creado exitosamente", data: links, errors: null});
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
        const links = await deleteLinksService(Number(id));
        res.json({status: "success", code: 200, message: "Link eliminado exitosamente", data: links, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al eliminar el link",
            data: null,
            errors: err.message });
    }
}

export const getStatusController = async (req: Request, res: Response) => {
    try{
        const { shortUrl } = req.params;
        const link = await statsService(shortUrl.toString());
        res.json({status: "success", code: 200, message: "Link obtenido exitosamente", data: link, errors: null});
    }catch(err: any){
        res.status(500).json({ status: "error", code: 500,
            message: "Error al obtener el link",
            data: null,
            errors: err.message });
    }
}