import { openDb } from "../config/db";


export class Click {
    constructor(
        public id: number,
        public url_id: number,
        public created_at: string,
    ) { }
}

export class ClickModel {
    static async createClick(click: Click) {
        try {
            const db = await openDb();
            const createClick = await db.run("INSERT INTO clicks (url_id, created_at) VALUES (?, ?)", [click.url_id, click.created_at]);
            return createClick;
        } catch (error) {
            throw error;
        }
    }
}