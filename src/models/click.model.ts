import { openDb } from "../config/db";


export class Click {
    constructor(
        public id: number,
        public url_id: number,
        public created_at: string,
        public country: string
    ) { }
}

export class ClickModel {
    static async createClick(click: Click) {
        try {
            const db = await openDb();
            const createClick = await db.run("INSERT INTO clicks (url_id, created_at, country) VALUES (?, ?, ?)", [click.url_id, click.created_at, click.country]);
            return createClick;
        } catch (error) {
            throw error;
        }
    }
}