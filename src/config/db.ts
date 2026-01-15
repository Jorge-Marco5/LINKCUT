import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";

const DB_DIR = path.resolve(process.cwd(), "storage/database");
const DB_PATH = path.join(DB_DIR, "database.db");

export async function openDb() {
    return open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });
}

// verificar si existe la base de datos, si no la creamos en el directorio storage/database
export async function checkDb() {
    try {
        // Ensure directory exists
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
            console.log(`Directory created: ${DB_DIR}`);
        }

        const db = await openDb();
        await initDb(); // Always run initDb to ensure tables exist
        console.log("Database connected and initialized");
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
}

// Inicializar tabla de usuarios
export async function initDb() {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT,
            created_at TEXT,
            role TEXT DEFAULT 'user'
        );

        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            short_url TEXT UNIQUE,
            user_id INTEGER,
            created_at TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        --estadisticas de clicks
        CREATE TABLE IF NOT EXISTS clicks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url_id INTEGER,
            created_at TEXT,
            FOREIGN KEY (url_id) REFERENCES urls (id)
        );

        CREATE TABLE IF NOT EXISTS qr_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            qr_code TEXT UNIQUE,
            url_id INTEGER,
            created_at TEXT,
            FOREIGN KEY (url_id) REFERENCES urls (id)
        );
    `);
}