import mongoose from 'mongoose'
import { EnvConfig } from './index'

export const mongoConnection = async (): Promise<mongoose.Mongoose> => {
    try {
        return await mongoose.connect(EnvConfig.MongoDB.uri, {
            dbName: EnvConfig.MongoDB.dbName,
            connectTimeoutMS: 3000,
            socketTimeoutMS: 5000,
        })
    } catch (error) {
        throw error
    }
}
