import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const logginValidator = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const schema = z.object({
        email: z.string().email("Email invalido").min(1, "El email es requerido"),
        password: z.string().min(1, "La contraseña es requerida"),
    });
    const result = schema.safeParse({ email, password });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().email?.message });
    }
    next();
};

export const registerValidator = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    const schema = z.object({
        username: z.string().min(1, "El nombre es requerido"),
        email: z.string().email("Email invalido").min(1, "El email es requerido"),
        password: z.string().min(1, "La contraseña es requerida"),
    });
    const result = schema.safeParse({ username, email, password });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().email?.message });
    }
    next();
};

export const changePasswordValidator = (req: Request, res: Response, next: NextFunction) => {
    const { username, old_password, verify_old_password, new_password } = req.body;
    const schema = z.object({
        username: z.string().min(1, "El nombre es requerido"),
        old_password: z.string().min(1, "La contraseña es requerida"),
        verify_old_password: z.string().min(1, "La contraseña es requerida"),
        new_password: z.string().min(1, "La contraseña es requerida"),
    });
    const result = schema.safeParse({ username, old_password, verify_old_password, new_password });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().username?.message });
    }
    next();
};

export const urlValidator = (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;
    const schema = z.object({
        url: z.string().min(1, "La URL es requerida"),
    });
    const result = schema.safeParse({ url });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().url?.message });
    }
    next();
};

export const idValidator = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const schema = z.object({
        id: z.string().min(1, "El ID es requerido"),
    });
    const result = schema.safeParse({ id });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().id?.message });
    }
    next();
};

export const shortUrlValidator = (req: Request, res: Response, next: NextFunction) => {
    const { shortUrl } = req.params;
    const schema = z.object({
        shortUrl: z.string().min(1, "El shortUrl es requerido"),
    });
    const result = schema.safeParse({ shortUrl });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().shortUrl?.message });
    }
    next();
};

export const textValidator = (req: Request, res: Response, next: NextFunction) => {
    const { text } = req.body;
    const schema = z.object({
        text: z.string().min(1, "El texto es requerido").max(255, "El texto debe tener maximo 255 caracteres"),
    });
    const result = schema.safeParse({ text });
    if (!result.success) {
        return res.status(400).json({ message: result.error.format().text?.message });
    }
    next();
};
    