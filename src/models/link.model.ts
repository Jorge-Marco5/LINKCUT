import { openDb } from "../config/db";

export class Link {
    constructor(
        public id: number,
        public url: string,
        public short_url: string,
        public user_id: number,
        public created_at: string,
        public is_active: number = 1,
        public is_protected: number = 0,
        public password: string = "",
        public expires_at: string = ""
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

    static async updateLink(id: number, short_url: string, is_protected: number, password: string, expires_at: string) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET short_url = ?, is_protected = ?, password = ?, expires_at = ? WHERE id = ?", [short_url, is_protected, password, expires_at, id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }

    static async getLink(id: number, userId: number) {
        try {
            const db = await openDb();
            const getLink = await db.get<any>(
                "SELECT u.id, u.url, u.short_url, u.user_id, u.created_at, u.is_active, u.is_protected, u.expires_at, u.alias, count(c.id) as clicks " +
                "FROM urls u LEFT JOIN clicks c ON u.id = c.url_id " +
                "WHERE u.id = ? AND user_id = ? GROUP BY u.id",
                [id, userId]
            );
            return getLink;
        } catch (error) {
            throw error;
        }
    }

    static async getLinkByShortUrl(short_url: string) {
        try {
            const db = await openDb();
            const getLink = await db.get<Link>("SELECT id, url FROM urls WHERE short_url = ?", [short_url]);
            return getLink;
        } catch (error) {
            throw error;
        }
    }

    static async getLinks(userId: number, page: number, limit: number, offset: number) {
        try {
            const db = await openDb();
            const getLink = await db.all<Link>(
                "SELECT u.id, u.url, u.short_url, u.user_id, u.created_at, u.is_active, u.is_protected, u.expires_at, u.alias, count(c.id) as clicks " +
                "FROM urls u LEFT JOIN clicks c ON u.id = c.url_id " +
                "WHERE user_id = ? GROUP BY u.id ORDER BY u.id DESC LIMIT ? OFFSET ?",
                [userId, limit, offset]
            );
            const total = await db.get("SELECT count(*) as total FROM urls WHERE user_id = ?", [userId]);
            return { getLink, total: total.total, page, limit, offset };
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
            const redirectTo = await db.get<Link>("SELECT id, url, is_active, is_protected, expires_at FROM urls WHERE short_url = ?", [shortUrl]);
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

    //apagar la protección de un link
    static async unprotectLink(id: number) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET is_protected = 0, password = '' WHERE id = ?", [id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }

    //agregar protección a un link
    static async protectLink(id: number, password: string) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET is_protected = 1, password = ? WHERE id = ?", [password, id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }

    //agregar fecha de expiración a un link
    static async setExpiresAt(id: number, expires_at: string) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET expires_at = ? WHERE id = ?", [expires_at, id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }

    //eliminar fecha de expiración de un link
    static async removeExpiresAt(id: number) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET expires_at = '' WHERE id = ?", [id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }

    //agregar alias a un link
    static async setAlias(id: number, alias: string) {
        try {
            const db = await openDb();
            const updateLink = await db.run("UPDATE urls SET short_url = ? WHERE id = ?", [alias, id]);
            return updateLink;
        } catch (error) {
            throw error;
        }
    }

    //verificar que el alias no exista
    static async verifyAlias(alias: string) {
        try {
            const db = await openDb();
            const link = await db.get("SELECT short_url FROM urls WHERE short_url = ?", [alias]);
            if (link) {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(short_url: string) {
        try {
            const db = await openDb();
            const link = await db.get("SELECT is_protected, password FROM urls WHERE short_url = ?", [short_url]);
            return link;
        } catch (error) {
            throw error;
        }
    }
}