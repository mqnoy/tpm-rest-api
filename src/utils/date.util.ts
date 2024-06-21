import { DateTime } from 'luxon'

export function DateToISOString(d: Date): string | null {
    const dIso = DateTime.fromJSDate(d).toUTC()
    if (!dIso) {
        return null
    }
    return dIso.toISO()
}

export function StringISOToJSDate(s: string): Date {
    return DateTime.fromISO(s).toJSDate()
}

export function Now(): Date {
    const dIso = DateTime.utc().toISO()
    return DateTime.fromISO(dIso).toJSDate()
}

export function StringISOToDateTime(s: string): DateTime {
    return DateTime.fromISO(s)
}
