import express from 'express'

class ResponseCustom<T> {
    declare message: string
    declare data: T
    declare status: number

    constructor(message: string, data: T, status: number) {
        this.message = message
        this.data = data
        this.status = status
    }

    wrapResponse(res: express.Response) {
        return res.status(this.status).json({
            success: String(this.status).startsWith('2') ? true : false,
            message: this.message,
            data: this.data,
        })
    }
}

export default ResponseCustom
