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

    resolveFileId(fileReference) {
        if (!fileReference) return "";
        if (typeof fileReference === "string") return fileReference;

        // Handle possible Appwrite response shapes for file references.
        return fileReference.$id || fileReference.fileId || fileReference.id || "";
    }

    // 🔹 Create Post
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        return this.database.createRow({
            databaseId: config.appWriteDatabaseId,
            tableId: config.appWriteTableId,
            rowId: slug || ID.unique(),
            data: {
                title,
                content,
                featuredImage,
                status,
                userId,
            }
        });
    }

    // 🔹 Update Post
    async updatePost(rowId, { title, content, featuredImage, status }) {
        return this.database.updateRow({
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
    }

    // 🔹 Delete Post
    async deletePost(rowId) {
        await this.database.deleteRow({
            databaseId: config.appWriteDatabaseId,
            tableId: config.appWriteTableId,
            rowId: rowId
        });
        return true;
    }

    // 🔹 Get Single Post
    async getPost(rowId) {
        return this.database.getRow({
            databaseId: config.appWriteDatabaseId,
            tableId: config.appWriteTableId,
            rowId: rowId
        });
    }

    // 🔹 Get All Active Posts
    async getPosts(queries = []) {
        const response = await this.database.listRows({
            databaseId: config.appWriteDatabaseId,
            tableId: config.appWriteTableId,
            queries: queries.length
                ? queries
                : [Query.equal("status", "active")]
        });

        const normalizedRows = Array.isArray(response?.documents)
            ? response.documents
            : Array.isArray(response?.rows)
                ? response.rows
                : [];

        return {
            ...response,
            documents: normalizedRows,
            rows: normalizedRows,
        };
    }

    // =========================
    // 🔹 FILE UPLOAD (STORAGE)
    // =========================

    async uploadFile(file) {
        return this.storage.createFile({
            bucketId: config.appWriteBucketId,
            fileId: ID.unique(),
            file: file
        });
    }

    async deleteFile(fileId) {
        const resolvedFileId = this.resolveFileId(fileId);

        if (!resolvedFileId) {
            return false;
        }

        await this.storage.deleteFile({
            bucketId: config.appWriteBucketId,
            fileId: resolvedFileId
        });
        return true;
    }

    getFilePreview(fileId) {
        const resolvedFileId = this.resolveFileId(fileId);

        if (!resolvedFileId) {
            return "";
        }

        return this.storage.getFileView(
            config.appWriteBucketId,
            resolvedFileId
        );
    }
}

const service = new Service();
export default service;