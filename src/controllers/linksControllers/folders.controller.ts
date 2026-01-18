import { Request, Response } from "express";
import { getFoldersService, getFolderService, postFolderService, deleteFolderService } from "@/services/folder.service";

//listar las carpetas del usuario 
export const getFoldersController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Usuario no autenticado",
                data: null,
                errors: "Usuario no autenticado",
            });
        }

        const folders = await getFoldersService(userId);
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Carpetas obtenidas exitosamente",
            data: folders,
            errors: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Error al obtener las carpetas",
            data: null,
            errors: error,
        });
    }
};

export const getFolderController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const folderId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Usuario no autenticado",
                data: null,
                errors: "Usuario no autenticado",
            });
        }

        const folder = await getFolderService(userId, folderId.toString());
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Carpeta obtenida exitosamente",
            data: folder,
            errors: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Error al obtener la carpeta",
            data: null,
            errors: error,
        });
    }
};

export const postFolderController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const folderName = req.body.name;

        if (!userId) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Usuario no autenticado",
                data: null,
                errors: "Usuario no autenticado",
            });
        }

        const folder = await postFolderService(userId, folderName);
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Carpeta creada exitosamente",
            data: folder,
            errors: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Error al crear la carpeta",
            data: null,
            errors: error,
        });
    }
};

export const deleteFolderController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const folderId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                status: "error",
                code: 401,
                message: "Usuario no autenticado",
                data: null,
                errors: "Usuario no autenticado",
            });
        }

        const folder = await deleteFolderService(userId, folderId.toString());
        return res.status(200).json({
            status: "success",
            code: 200,
            message: "Carpeta eliminada exitosamente",
            data: folder,
            errors: null,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            code: 500,
            message: "Error al eliminar la carpeta",
            data: null,
            errors: error,
        });
    }
};
