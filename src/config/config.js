const config = {
    appWriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appWriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appWriteTableId:String(import.meta.env.VITE_APPWRITE_TABLE_ID),
    appWriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}

export default config


// we do this because from here we confrm that the value that we will get is string and we directly import only this where we need it 