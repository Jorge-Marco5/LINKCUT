import { openDb } from "@/config/db";

export class TextQR {
    id: number;
    text: string;
    user_id: number;
    created_at: string;

    constructor(id: number, text: string, user_id: number, created_at: string) {
        this.id = id;
        this.text = text;
        this.user_id = user_id;
        this.created_at = created_at;
    }
}

export class TextQRModel {

    static async getAll(user_id: number) {
        const db = await openDb();
        const rows = await db.all(`SELECT * FROM textqr WHERE user_id = ? ORDER BY created_at DESC`, [user_id]);
        return rows.map((row) => new TextQR(row.id, row.text, row.user_id, row.created_at));
    }

    static async create(text: string, user_id: number) {
        const db = await openDb();
        const textQR = new TextQR(0, text, user_id, new Date().toISOString());
        await db.run(
            `INSERT INTO textqr (text, user_id, created_at) VALUES (?, ?, ?)`,
            [textQR.text, textQR.user_id, textQR.created_at]
        );
        return textQR;
    }

    static async delete(id: number, user_id: number) {
        const db = await openDb();
        await db.run(`DELETE FROM textqr WHERE id = ? AND user_id = ?`, [id, user_id]);
    }

    static async update(id: number, text: string, user_id: number) {
        const db = await openDb();
        await db.run(`UPDATE textqr SET text = ?, user_id = ?, created_at = ? WHERE id = ?`, [text, user_id, new Date().toISOString(), id]);
    }
}
