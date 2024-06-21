import Validator from 'fastest-validator'
import { ValidationError } from 'fastest-validator'
import { dateUtil } from '../../utils'

const v = new Validator({
    useNewCustomCheckerFunction: true, // using new version
})

// add message for custom rule
v.addMessage('isoDate', "The '{field}' must be a valid ISO 8601 date. Actual: {actual}")

// add custom rules
v.alias('isoDate', {
    type: 'custom',
    check: (value: any, errors: any, _schema: any) => {
        try {
            if (typeof value !== 'string') {
                return false
            }

            const dt = dateUtil.StringISOToDateTime(value)
            if (!dt.isValid) {
                errors.push({ type: 'isoDate', actual: value })
            }

            return dt.toISO()
        } catch (err) {
            errors.push({ type: 'isoDate', actual: value })
        }
    },
})

export async function validate(body: unknown, schema: Object): Promise<ValidationError[]> {
    const check = v.compile(schema)
    const valid = await check(body)
    const errors: ValidationError[] = []

    if (valid !== true) {
        for (const e of valid) {
            errors.push({
                field: e.field,
                message: e.message,
                type: e.type,
            })
        }
    }

    return errors
}
