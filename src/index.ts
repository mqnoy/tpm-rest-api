import cors from 'cors'
import express from 'express'
import { EnvConfig, mongoConnection } from './config'
import { HttpStatus } from './enums'
import { HttpException } from './exceptions'
import * as middleware from './middleware'
import { projectController } from './project/controller'
import { taskController } from './task/controller'

const App = (): express.Application => {
    const app: express.Application = express()

    const corsOptions = {
        origin: '*',
    }
    app.use(cors(corsOptions))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // Initialize routes
    app.use(projectController.route)
    app.use(taskController.route)

    app.get('/', (_req, res, _next) => {
        res.status(HttpStatus.OK).send('ok')
    })

    //fallback url
    app.all('*', (req, _res, _next) => {
        throw new HttpException(`can't find ${req.originalUrl}`, HttpStatus.NOT_FOUND)
    })

    app.use(middleware.ErrorHandler)

    return app
}

async function main(): Promise<void> {
    // Initialize mongoDB connection
    const mongoose = await mongoConnection()

    // Initialize app
    const app = App()

    // Start server
    const PORT = EnvConfig.appPort
    const server = app.listen(PORT, () => {
        console.debug(`Server running in port: ${PORT}`)
    })

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason)
        mongoose.connection.close()
        server.close(() => {
            console.debug('Closed out remaining connections')
        })
    })

    process.on('SIGTERM', () => {
        console.debug('SIGTERM signal received.')
        mongoose.connection.close()
        server.close(() => {
            console.debug('Closed out remaining connections')
        })
    })

    process.on('SIGINT', () => {
        console.debug('SIGINT signal received.')
        mongoose.connection.close()
        server.close(() => {
            console.debug('Closed out remaining connections')
        })
    })
}

void main()
