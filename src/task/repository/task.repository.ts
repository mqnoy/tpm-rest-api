import { FilterQuery, Types } from 'mongoose'
import { ITask, Task, TaskCreation } from '../../model'
import { ListPayload } from '../../dto'
import { FilterKeys } from '../../constans'
import { dataUtil } from '../../utils'

export const createTask = async (data: TaskCreation): Promise<ITask> => {
    return await Task.create(data)
}

export const findAllTaskByProjectId = async (payload: ListPayload): Promise<ITask[]> => {
    const { filters } = payload
    const projectId = filters[FilterKeys.projectId] as string

    const andCluse: FilterQuery<ITask>[] = []
    const objCluse = {}

    // forced filtered by projectId
    andCluse.push({ project: { $eq: new Types.ObjectId(projectId) } })

    // handle filter  isDone
    if (filters[FilterKeys.isDone] !== undefined) {
        const isDone = dataUtil.parseToBool(filters[FilterKeys.isDone])
        if (isDone) {
            andCluse.push({ doneAt: { $ne: null } })
        } else {
            andCluse.push({ doneAt: { $eq: null } })
        }
    }

    if (andCluse.length) {
        Object.assign(objCluse, {
            $and: andCluse,
        })
    }

    return await Task.find(objCluse).exec()
}

export const updateTaskById = async (id: string, data: Partial<ITask>): Promise<number> => {
    const result = await Task.updateOne(
        {
            _id: id,
        },
        data
    ).exec()

    return result.modifiedCount
}

export const findTaskById = async (id: string): Promise<ITask | null> => {
    return await Task.findOne({
        _id: id,
    }).exec()
}

export const deleteTaskById = async (id: string): Promise<number> => {
    const result = await Task.deleteOne({
        _id: id,
    }).exec()

    return result.deletedCount
}

export const findTaskByStartTime = async (
    projectId: string,
    startTime: string
): Promise<ITask | null> => {
    return await Task.findOne({
        $and: [
            { project: { $eq: new Types.ObjectId(projectId) } },
            { startTime: { $eq: startTime } },
        ],
    }).exec()
}
