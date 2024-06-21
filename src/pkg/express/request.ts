import express from 'express'

export function ParseQueryFilters(req: express.Request): Record<string, unknown> {
    const rqFilters = req.query.filters
    if (!rqFilters) {
        return {}
    }

    let results: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(rqFilters)) {
        results[k] = v
    }

    return results
}

export function MustGet(req: express.Request, key: string): Error | undefined {
    const params = req.params[key]
    console.log('params: ', params)

    if (!params) {
        return new Error('id is required')
    }
}
