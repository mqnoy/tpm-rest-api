import { FilterKeys } from '../../constans'
import {
    ListPayload,
    ListResponse,
    ProjectDetailPayload,
    ProjectPayload,
    ProjectResult,
    ProjectTaskPayload,
    TaskResult,
    UpdatePayload,
} from '../../dto'
import { HttpStatus } from '../../enums'
import { HttpException } from '../../exceptions'
import { IProject } from '../../model'
import { taskUseCase } from '../../task/usecase'
import { projectRepository } from '../repository'

const composeProject = (p: IProject): ProjectResult => {
    return {
        id: p._id.toString(),
        name: p.name,
        description: p.description,
    }
}

export const createProject = async (payload: ProjectPayload): Promise<ProjectResult> => {
    const { name, description } = payload
    const project = await projectRepository.createProject({
        name,
        description,
    })
    return composeProject(project)
}

export const listProjects = async (payload: ListPayload): Promise<ListResponse<ProjectResult>> => {
    const projects = await projectRepository.findAllProject(payload)

    const rows: ProjectResult[] = []
    for (const p of projects) {
        const temp = composeProject(p)
        rows.push(temp)
    }

    return {
        metadata: null,
        rows,
    }
}

export const detailProject = async (payload: ProjectDetailPayload): Promise<ProjectResult> => {
    const { id } = payload
    const project = await projectRepository.findProjectById(id)
    if (!project) {
        throw new HttpException(`project doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    return composeProject(project)
}

export const updateProject = async (
    payload: UpdatePayload<ProjectPayload>
): Promise<ProjectResult> => {
    const { data } = payload
    const id = data.id as string

    // determine project by id
    const project = await projectRepository.findProjectById(id)
    if (!project) {
        throw new HttpException(`project doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    await projectRepository.updateProjectById(id, {
        ...data,
    })

    Object.assign(project, data)
    return composeProject(project)
}

export const deleteProject = async (payload: ProjectDetailPayload): Promise<void> => {
    const { id } = payload
    const project = await projectRepository.findProjectById(id)
    if (!project) {
        throw new HttpException(`project doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    await projectRepository.deleteProjectById(project._id.toString())
}

export const createProjectTask = async (payload: ProjectTaskPayload): Promise<TaskResult> => {
    const { projectId, task } = payload
    const project = await projectRepository.findProjectById(projectId)
    if (!project) {
        throw new HttpException(`project doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    // call task usecase for creating task
    task.projectId = project._id.toString()
    const result = await taskUseCase.createTask({
        ...task,
    })

    return result
}

export const listProjectTasks = async (payload: ListPayload) => {
    const id = payload.filters[FilterKeys.projectId] as string
    const project = await projectRepository.findProjectById(id)
    if (!project) {
        throw new HttpException(`project doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    // call task usecase for listing data task forced filter by projectId
    const projectId = project._id.toString()
    payload.filters[FilterKeys.projectId] = projectId
    const result = await taskUseCase.listTasks(payload)

    return result
}
