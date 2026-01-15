import { openDb } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Registro
export async function register(username: string, email: string, password: string) {
    const db = await openDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", username, email, hashedPassword, "user");
        return { message: "Usuario registrado correctamente" };
    } catch (err) {
        throw new Error("El usuario ya existe");
    }
}

// Login
export async function login(email: string, password: string) {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (!user) throw new Error("Usuario no encontrado");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Contraseña incorrecta");
    const token = jwt.sign(
        { 
            id: user.id, 
            username: user.username,
            email: user.email,
            role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: "1h" }
    );
    return { token };
}

export async function changePassword(username: string, password: string) {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE username = ?", username);
    if (!user) throw new Error("Usuario no encontrado");
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("UPDATE users SET password = ? WHERE username = ?", hashedPassword, username);
    return { message: "Contraseña cambiada exitosamente" };
}

// Middleware de autorización
import { Request, Response, NextFunction } from "express";

export function authMiddleware(requiredRole?: string) {
    return function (req: Request, res: Response, next: NextFunction) {
        let token = req.cookies?.token;
        
        // Fallback to Header if no cookie
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
             // If browser request (accepts html), redirect to login
             if (req.accepts('html')) {
                 return res.redirect("/auth/login");
             }
             return res.status(401).json({ message: "Token requerido" });
        }

        try {
            //guardar datos de un usuario logueado en el request
            const payload = jwt.verify(token, JWT_SECRET) as { id: number; username: string; email: string; role: string };
            if (requiredRole && payload.role !== requiredRole) {
                if (req.accepts('html')) {
                    // Could redirect to a 403 page or back to dashboard with error
                    return res.redirect("/auth/login?error=Acceso denegado");
                }
                return res.status(403).json({ message: "Acceso denegado" });
            }
            req.user = payload;
            next();
        } catch {
             if (req.accepts('html')) {
                 return res.redirect("/auth/login");
             }
            return res.status(401).json({ message: "Token inválido" });
        }
    };
}