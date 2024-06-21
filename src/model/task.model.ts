import { Schema, Types, model } from 'mongoose'

export interface ITask {
    _id: Types.ObjectId
    title: string
    description: string
    startTime: Date
    endTime: Date
    doneAt: Date | null
    project: Types.ObjectId
}

const TaskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    doneAt: {
        type: Date,
        required: false,
        default: null,
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
})

export type TaskCreation = Omit<ITask, '_id'>

export const Task = model<ITask>('Task', TaskSchema)
