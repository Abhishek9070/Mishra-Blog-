import config from "../config/config.js";
import { Client, ID, TablesDB, Storage, Query, Permission, Role } from "appwrite";

class Service {
    client = new Client();
    database;
    storage;
    profileCache = new Map();

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

    async getPostsByUser(userId, includeInactive = true) {
        const queries = [Query.equal("userId", userId)];

        if (!includeInactive) {
            queries.push(Query.equal("status", "active"));
        }

        return this.getPosts(queries);
    }

    normalizePublicProfile(userId, profileData = {}) {
        return {
            userId,
            displayName: profileData?.displayName || "",
            headline: profileData?.headline || "",
            bio: profileData?.bio || "",
            gender: profileData?.gender || "Prefer not to say",
            location: profileData?.location || "",
            website: profileData?.website || "",
            profileImageId: this.resolveFileId(profileData?.profileImageId),
            updatedAt: profileData?.updatedAt || new Date().toISOString(),
        };
    }

    getPublicProfileFileView(userId) {
        if (!userId) return "";

        return this.storage.getFileView(config.appWriteBucketId, userId);
    }

    async upsertPublicProfile(userId, profileData = {}) {
        if (!userId) {
            throw new Error("User ID is required to update profile.");
        }

        const normalizedProfile = this.normalizePublicProfile(userId, profileData);
        const payload = JSON.stringify(normalizedProfile);
        const profileFile = new File([payload], `profile-${userId}.json`, {
            type: "application/json",
        });

        try {
            await this.storage.deleteFile({
                bucketId: config.appWriteBucketId,
                fileId: userId,
            });
        } catch (error) {
            if (error?.code !== 404 && error?.status !== 404) {
                console.log("Appwrite service :: upsertPublicProfile :: delete error", error);
            }
        }

        const result = await this.storage.createFile({
            bucketId: config.appWriteBucketId,
            fileId: userId,
            file: profileFile,
            permissions: [
                Permission.read(Role.any()),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
            ],
        });

        this.profileCache.set(userId, normalizedProfile);
        return result;
    }

    async getPublicProfile(userId, forceRefresh = false) {
        if (!userId) {
            return null;
        }

        if (!forceRefresh && this.profileCache.has(userId)) {
            return this.profileCache.get(userId);
        }

        try {
            const response = await fetch(this.getPublicProfileFileView(userId));

            if (!response.ok) {
                return null;
            }

            const profile = await response.json();
            const normalizedProfile = this.normalizePublicProfile(userId, profile);
            this.profileCache.set(userId, normalizedProfile);
            return normalizedProfile;
        } catch (error) {
            if (error?.code !== 404 && error?.status !== 404) {
                console.log("Appwrite service :: getPublicProfile :: error", error);
            }

            return null;
        }
    }

    // =========================
    // 🔹 FILE UPLOAD (STORAGE)
    // =========================

    async uploadFile(file, userId = "") {
        const permissions = [Permission.read(Role.any())];

        if (userId) {
            permissions.push(
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            );
        }

        return this.storage.createFile({
            bucketId: config.appWriteBucketId,
            fileId: ID.unique(),
            file: file,
            permissions,
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