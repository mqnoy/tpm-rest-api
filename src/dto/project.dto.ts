import { TaskPayload } from './task.dto'

export interface ProjectResult {
    id: string
    name: string
    description: string
}

export interface ProjectPayload {
    id?: string
    name: string
    description: string
}

export interface ProjectDetailPayload {
    id: string
}

export interface ProjectTaskPayload {
    projectId: string
    task: TaskPayload
}
