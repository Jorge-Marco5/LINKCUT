import { openDb } from "../config/db";

export const getLinksService = async (userId: number) => {
    const db = await openDb();
    const links = await db.all("SELECT u.*, COUNT(c.id) as clicks FROM urls u LEFT JOIN clicks c ON u.id = c.url_id WHERE u.user_id = ? GROUP BY u.id ORDER BY u.id DESC", [userId]);   
    return links;
}

export const getLinkService = async (shortUrl: string) => {
    const db = await openDb();
    const link = await db.get("SELECT id, url FROM urls WHERE short_url = ?", shortUrl);
    return link;
}

export const postLinksService = async (url: string, shortUrl: string, userId: number, createdAt: string) => {
    const db = await openDb();
    const links = await db.run("INSERT INTO urls (user_id, url, short_url, created_at) VALUES (?, ?, ?, ?)", [userId, url, shortUrl, createdAt]);
    return links;
}

export const deleteLinksService = async (id: number) => {
    const db = await openDb();
    const links = await db.run("DELETE FROM urls WHERE id = ?", [id]);
    return links;
}

export const clickService = async (shortUrl: string) => {
    const db = await openDb();
    const link = await db.run("INSERT INTO clicks (url_id) VALUES (?)", [shortUrl]);
    return link;
}

//obtener estadisticas de clicks con 7 dias de diferencia
export const statsService = async (shortUrl: string) => {
    const db = await openDb();
    const stats = await db.all("SELECT date(created_at) as date, COUNT(*) as clicks FROM clicks WHERE url_id = (SELECT id FROM urls WHERE short_url = ?) AND created_at >= date('now', '-7 days') GROUP BY date", [shortUrl]);
    return stats;
}