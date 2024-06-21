import 'dotenv/config'

export const EnvConfig = {
    appPort: Number(process.env.APP_PORT || '3000'),
    MongoDB: {
        uri: process.env.MONGO_URI || '',
        dbName: process.env.MONGO_DB_NAME || 'task_project',
    },
    MigrateMongo: {
        mode: process.env.MIGRATE_MODE || 'development',
        uri: process.env.MIGRATE_MONGO_URI || '',
        autoSync: process.env.MIGRATE_AUTOSYNC || 'false',
        collection: process.env.MIGRATE_MONGO_COLLECTION || 'ts_migration',
    },
}
