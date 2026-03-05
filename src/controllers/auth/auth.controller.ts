import { Request, Response } from "express";
import { register, login, changePassword } from "@/utils/auth";
import { initDb } from "@/config/db";

export const registerController = async (req: Request, res: Response) => {
    await initDb();
    try {
        const { username, email, password } = req.body;
        const result = await register(username, email, password);
        res.json({ message: "Usuario registrado correctamente" });
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

export const loginController = async (req: Request, res: Response) => {
    await initDb();
    try {
        const { email, password } = req.body;
        const result = await login(email, password);

        // Set cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: "Usuario logueado correctamente" });
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}



export const changePasswordController = async (req: Request, res: Response) => {
    await initDb();
    try {
        const { username, old_password, verify_old_password, new_password } = req.body;
        if (old_password !== verify_old_password) throw new Error("Las contraseñas no coinciden");
        const result = await changePassword(username, new_password);
        res.json({ message: "Contraseña cambiada exitosamente" });
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
}

export const logoutController = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.json({ message: "Usuario deslogueado correctamente" });
}