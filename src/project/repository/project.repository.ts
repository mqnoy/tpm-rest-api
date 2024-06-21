import { ListPayload } from '../../dto'
import { IProject, Project, ProjectCreation } from '../../model'

export const createProject = async (data: ProjectCreation): Promise<IProject> => {
    return await Project.create(data)
}
export const findAllProject = async (payload: ListPayload): Promise<IProject[]> => {
    const projects = await Project.find().exec()

    return projects
}

export const findProjectById = async (id: string): Promise<IProject | null> => {
    return Project.findOne({
        _id: id,
    }).exec()
}

export const updateProjectById = async (id: string, data: Partial<IProject>): Promise<number> => {
    const result = await Project.updateOne(
        {
            _id: id,
        },
        data
    ).exec()

    return result.modifiedCount
}

export const deleteProjectById = async (id: string): Promise<number> => {
    const result = await Project.deleteOne({
        _id: id,
    }).exec()

    return result.deletedCount
}
