import { Request, Response } from "express";
import { UserModel } from "@/models/user.model";

export const getUserController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserModel.getUser(id.toString());
        if (!user) {
            return res.status(404).json({status: "error", code: 404, message: "Usuario no encontrado", data: null, errors: "Usuario no encontrado" });
        }
        res.json({status: "success", code: 200, message: "Usuario encontrado", data: user, errors: null});
    } catch (error: any) {
        res.status(500).json({status: "error", code: 500, message: "Error al buscar usuario", data: null, errors: error.message });
    }
}

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.getUsers();
        if (!users) {
            return res.status(404).json({status: "error", code: 404, message: "Usuarios no encontrados", data: null, errors: "Usuarios no encontrados" });
        }
        res.json({status: "success", code: 200, message: "Usuarios encontrados", data: users, errors: null});
    } catch (error: any) {
        res.status(500).json({status: "error", code: 500, message: "Error al buscar usuarios", data: null, errors: error.message });
    }
}

export const createUserController = async (req: Request, res: Response) => {
    try {
        const user = await UserModel.createUser(req.body);
        if (!user) {
            return res.status(404).json({status: "error", code: 404, message: "Usuario no encontrado", data: null, errors: "Usuario no encontrado" });
        }
        res.json({status: "success", code: 200, message: "Usuario creado exitosamente", data: user, errors: null});
    } catch (error: any) {
        res.status(500).json({status: "error", code: 500, message: "Error al crear usuario", data: null, errors: error.message });
    }
}

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserModel.deleteUser(id.toString());
        if (!user) {
            return res.status(404).json({status: "error", code: 404, message: "Usuario no encontrado", data: null, errors: "Usuario no encontrado" });
        }
        res.json({status: "success", code: 200, message: "Usuario eliminado exitosamente", data: user, errors: null});
    } catch (error: any) {
        res.status(500).json({status: "error", code: 500, message: "Error al eliminar usuario", data: null, errors: error.message });
    }
}
