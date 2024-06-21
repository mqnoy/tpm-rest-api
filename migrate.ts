import { EnvConfig, mongoConnection } from './src/config'
;(async () => {
    await mongoConnection()
})()

export default {
    uri: EnvConfig.MigrateMongo.uri,
    collection: EnvConfig.MigrateMongo.collection,
    migrationsPath: './migrations',
    autosync: EnvConfig.MigrateMongo.autoSync,
}
