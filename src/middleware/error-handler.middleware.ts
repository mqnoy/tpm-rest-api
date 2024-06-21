import express from 'express'
import { HttpException } from '../exceptions'
import { HttpStatus } from '../enums'

export const ErrorHandler = (
    err: any,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    if (err instanceof HttpException) {
        res.status(err.status).json({
            success: false,
            message: err.message,
            data: null,
            errors: err.errors,
        })
    } else {
        console.error(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message,
            data: null,
        })
    }
}
