import { Schema, Types, model } from 'mongoose'

export interface IProject {
    _id: Types.ObjectId
    name: string
    description: string
}

const ProjectSchema = new Schema<IProject>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
})

export type ProjectCreation = Omit<IProject, '_id'>

export const Project = model<IProject>('Project', ProjectSchema)
