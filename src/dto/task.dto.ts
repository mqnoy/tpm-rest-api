export interface TaskResult {
    id: string
    title: string
    description: string
    startTime: string
    endTime: string
    doneAt: string | null
}

export interface TaskPayload {
    id?: string
    projectId: string
    title: string
    description: string
    startTime: string
    endTime: string
    doneAt: string | null
}

export interface TaskDetailPayload {
    id: string
    projectId?: string
}
