export class HttpException extends Error {
    declare status: number
    declare message: string
    declare errors: unknown[] | undefined

    constructor(message: string, status: number, errors?: unknown[]) {
        super(message)

        this.message = message
        this.status = status
        this.errors = errors

        Error.captureStackTrace(this, this.constructor)
    }
}
