import config from "../config/config.js";
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

class Service {
    client = new Client();
    database;
    storage;

    constructor() {
        this.client
            .setEndpoint(config.appWriteUrl)
            .setProject(config.appWriteProjectId);

        this.database = new TablesDB(this.client);
        this.storage = new Storage(this.client);
    }

    // 🔹 Create Post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.database.createRow({
                databaseId: config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                rowId: slug || ID.unique(),
                data: {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    // 🔹 Update Post
    async updatePost(rowId, { title, content, featuredImage, status }) {
        try {
            return await this.database.updateRow({
                databaseId: config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                rowId: rowId,
                data: {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    // 🔹 Delete Post
    async deletePost(rowId) {
        try {
            await this.database.deleteRow({
                databaseId: config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                rowId: rowId
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    // 🔹 Get Single Post
    async getPost(rowId) {
        try {
            return await this.database.getRow({
                databaseId: config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                rowId: rowId
            });
        } catch (error) {
            throw error;
        }
    }

    // 🔹 Get All Active Posts
    async getPosts(queries = []) {
        try {
            return await this.database.listRows({
                databaseId: config.appWriteDatabaseId,
                tableId: config.appWriteTableId,
                queries: queries.length
                    ? queries
                    : [Query.equal("status", "active")]
            });
        } catch (error) {
            throw error;
        }
    }

    // =========================
    // 🔹 FILE UPLOAD (STORAGE)
    // =========================

    async uploadFile(file) {
        try {
            return await this.storage.createFile({
                bucketId: config.appWriteBucketId,
                fileId: ID.unique(),
                file: file
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile({
                bucketId: config.appWriteBucketId,
                fileId: fileId
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    getFilePreview(fileId) {
        return this.storage.getFilePreview(
            config.appWriteBucketId,
            fileId
        );
    }
}

const service = new Service();
export default service;