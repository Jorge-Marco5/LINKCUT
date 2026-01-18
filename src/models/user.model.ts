import { openDb } from "../config/db";

export class User {
 constructor(
    public id: number,
    public username: string,
    public email: string,
    public created_at: string,
    public role: string,
    public password: string
 ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.created_at = created_at;
    this.role = role;
    this.password = password;
 }
}

export class UserModel{
    private users: User[] = [];

    static async createUser(user: User){
        try {
            const db = await openDb();
            const userCreated = await db.run("INSERT INTO users (username, email, password, created_at, role) VALUES (?, ?, ?, ?, ?)", [user.username, user.email, user.password, user.created_at, user.role]);
            return userCreated;
        } catch (error) {
            throw error;
        }
    }

    static async getUsers() {
            try {
            const db = await openDb();
            const users = await db.all<User>("SELECT id, username, email, created_at, role FROM users");
            return users;
        } catch (error) {
            throw error;
        }
    }

    static async getUser(id: string){
        try {
            const db = await openDb();
            const getUser = await db.get<User>("SELECT id, username, email, created_at, role FROM users WHERE id = ?", [id]);
            return getUser;
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(id: string){
        try {
            const db = await openDb();
            const deleteUser = await db.run("DELETE FROM users WHERE id = ?", [id]);
            return deleteUser;
        } catch (error) {
            throw error;
        }
    }
}
