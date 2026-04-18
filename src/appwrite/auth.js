import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";

const toSerializable = (value) => JSON.parse(
    JSON.stringify(value, (_key, nestedValue) =>
        typeof nestedValue === "function" ? undefined : nestedValue
    )
);

class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appWriteUrl)
            .setProject(config.appWriteProjectId)
        this.account = new Account(this.client)
    }

    async createAccount({ email, password, name }) {
        const userAccount = await this.account.create({
            userId: ID.unique(),
            email,
            password,
            name
        })

        if (userAccount) {
            return this.login({ email, password })
        }

        return userAccount
    }

    async login({ email, password }) {
        return this.account.createEmailPasswordSession({ email, password })
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get()
            if (user) return toSerializable(user);
            else return null;
        } catch (error) {
            // 401 for guests is expected when no session exists yet.
            if (error?.code === 401 || error?.status === 401) {
                return null
            }
            throw error
        }
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService()
export default authService