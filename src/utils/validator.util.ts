import { validate } from '../pkg/fasttest-validator/validator'
import { HttpStatus } from '../enums'
import { HttpException } from '../exceptions'

export async function validator(body: unknown, schema: Object): Promise<void> {
    const errors = await validate(body, schema)

    if (errors.length) {
        throw new HttpException(`error validator`, HttpStatus.BAD_REQUEST, errors)
    }
}
