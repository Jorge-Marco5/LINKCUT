import { openDb } from "../config/db";

export class Link {
    constructor(
        public id: number,
        public url: string,
        public short_url: string,
        public user_id: number,
        public created_at: string,
        public is_active: number = 1
    ) { }
}

export class LinkModel {
    static async createLink(link: Link) {
        try {
            const db = await openDb();
            const createLink = await db.run("INSERT INTO urls (url, short_url, user_id, created_at) VALUES (?, ?, ?, ?)", [link.url, link.short_url, link.user_id, link.created_at]);
            const newLink = await db.get<Link>("SELECT * FROM urls WHERE id = ?", [createLink.lastID]);
            return newLink;
        } catch (error) {
            throw error;
        }
    }

    static async getLink(id: number, userId: number) {
        try {
            const db = await openDb();
            const getLink = await db.get<any>("SELECT u.*, count(c.id) as clicks FROM urls u LEFT JOIN clicks c ON u.id = c.url_id WHERE u.id = ? AND user_id = ? GROUP BY u.id", [id, userId]);
            return getLink;
        } catch (error) {
            throw error;
        }
    }

    static async getLinks(userId: number) {
        try {
            const db = await openDb();
            const getLink = await db.all<Link>("SELECT u.*, count(c.id) as clicks FROM urls u LEFT JOIN clicks c ON u.id = c.url_id WHERE user_id = ? GROUP BY u.id ORDER BY u.id DESC", [userId]);
            return getLink;
        } catch (error) {
            throw error;
        }
    }

    static async deleteLink(id: number) {
        try {
            const db = await openDb();
            const deleteLink = await db.run("DELETE FROM urls WHERE id = ?", [id]);
            return deleteLink;
        } catch (error) {
            throw error;
        }
    }

    static async shortUrl(shortUrl: string) {
        try {
            const db = await openDb();
            const redirectTo = await db.get<Link>("SELECT id, url, is_active FROM urls WHERE short_url = ?", [shortUrl]);
            return redirectTo;
        } catch (error) {
            throw error;
        }
    }
    //obtener la fecha de expiracion de un Link
    static async expiresAt(id: number) {
        try {
            const db = await openDb();
            const expiresAt = await db.get<Link>("SELECT expires_at FROM urls WHERE id = ?", [id]);
            return expiresAt;
        } catch (error) {
            throw error;
        }
    }

    //estadisticas de un link de maximo 30 dias ordenado por dias y cantidad de clicks (horario local)
    static async statsUrl(id: number) {
        try {
            const db = await openDb();
            // agrupamos usando la fecha local 'localtime' para evitar desfases UTC, revisamos los últimos 30 días
            const statsUrl = await db.all("SELECT date(created_at, 'localtime') as day, count(*) as clicks FROM clicks WHERE url_id = ? AND datetime(created_at, 'localtime') >= datetime('now', 'localtime', '-30 days') GROUP BY day ORDER BY day ASC", [id]);
            return statsUrl;
        } catch (error) {
            throw error;
        }
    }

    // estadisticas de los top paises
    static async statsLocations(id: number) {
        try {
            const db = await openDb();
            // agrupamos por country devolviendo los mas visitados primero
            const statsLocations = await db.all("SELECT country, count(*) as clicks FROM clicks WHERE url_id = ? GROUP BY country ORDER BY clicks DESC", [id]);
            return statsLocations;
        } catch (error) {
            throw error;
        }
    }

    // alternar el estado is_active
    static async toggleStatus(id: number, status: number) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET is_active = ? WHERE id = ?", [status, id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }
}