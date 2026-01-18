import { openDb } from "@/config/db";

export class Folder {
    constructor(
        public id: number,
        public name: string,
        public color: string,
        public user_id: number,
        public created_at: string
    ) {}
}

export class FolderModel {
    
    private folders: Folder[] = [];

    static async createFolder(folder: Folder) {
        try {
            const db = await openDb();
            const createFolder = await db.run("INSERT INTO folders (name, color, user_id, created_at) VALUES (?, ?, ?, ?)", [folder.name, folder.color, folder.user_id, folder.created_at]);
            return createFolder;
        } catch (error) {
            throw error;
        }
    }

    static async getFolders(userId: number) {
        try {
            const db = await openDb();
            const getFolders = await db.all<Folder>("SELECT * FROM folders WHERE user_id = ?", [userId]);
            return getFolders;
        } catch (error) {
            throw error;
        }
    }

    static async deleteFolder(id: number) {
        try {
            const db = await openDb();
            const deleteFolder = await db.run("DELETE FROM folders WHERE id = ?", [id]);
            return deleteFolder;
        } catch (error) {
            throw error;
        }
    }

    static async updateFolder(folder: Folder) {
        try {
            const db = await openDb();
            const updateFolder = await db.run("UPDATE folders SET name = ?, color = ?, user_id = ?, created_at = ? WHERE id = ?", [folder.name, folder.color, folder.user_id, folder.created_at, folder.id]);
            return updateFolder;
        } catch (error) {
            throw error;
        }
    }

    static async getFolder(id: number) {
        try {
            const db = await openDb();
            const getFolder = await db.get<Folder>("SELECT * FROM folders WHERE id = ?", [id]);
            return getFolder;
        } catch (error) {
            throw error;
        }
    }
}