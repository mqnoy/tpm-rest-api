export interface ListPayload {
    filters: Record<string, unknown>
}

export interface ListResponse<T> {
    rows: T[]
    metadata: unknown
}

export interface UpdatePayload<T> {
    data: T
}
