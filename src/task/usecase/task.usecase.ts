import { Types } from 'mongoose'
import {
    ListPayload,
    ListResponse,
    TaskDetailPayload,
    TaskPayload,
    TaskResult,
    UpdatePayload,
} from '../../dto'
import { HttpStatus } from '../../enums'
import { HttpException } from '../../exceptions'
import { ITask } from '../../model'
import { dateUtil } from '../../utils'
import { taskRepository } from '../repository'

const composeTask = (t: ITask): TaskResult => {
    const startTime = dateUtil.DateToISOString(t.startTime) as string
    const endTime = dateUtil.DateToISOString(t.endTime) as string

    let doneAt: string | null = null
    if (t.doneAt) {
        doneAt = dateUtil.DateToISOString(t.doneAt)
    }
    return {
        id: t._id.toString(),
        title: t.title,
        description: t.description,
        startTime,
        endTime,
        doneAt,
    }
}

export const createTask = async (payload: TaskPayload): Promise<TaskResult> => {
    // validate startTime should smaller than endTime
    validateTimeOfTask(payload.startTime, payload.endTime)

    // validate task overlap in project
    await validateSameStartTime({
        projectId: payload.projectId.toString(),
        startTime: payload.startTime,
    })

    const task = await taskRepository.createTask({
        title: payload.title,
        description: payload.description,
        startTime: dateUtil.StringISOToJSDate(payload.startTime),
        endTime: dateUtil.StringISOToJSDate(payload.endTime),
        project: new Types.ObjectId(payload.projectId),
        doneAt: null,
    })
    return composeTask(task)
}

const validateSameStartTime = async (payload: {
    projectId: string
    startTime: string
}): Promise<void> => {
    // finding task by start time
    const existTask = await taskRepository.findTaskByStartTime(payload.projectId, payload.startTime)
    if (existTask) {
        throw new HttpException(`task can't overlap`, HttpStatus.BAD_REQUEST)
    }
}

const validateTimeOfTask = (startTime: string, endTime: string): void => {
    const start = dateUtil.StringISOToDateTime(startTime)
    const end = dateUtil.StringISOToDateTime(endTime)

    const isValid = start < end
    if (!isValid) {
        throw new HttpException(`start time should smaller than end time`, HttpStatus.BAD_REQUEST)
    }
}

const validateTaskIsDone = (doneAt: Date | null): void => {
    if (doneAt) {
        throw new HttpException(`task is already done, can't be changed`, HttpStatus.BAD_REQUEST)
    }
}

export const listTasks = async (payload: ListPayload): Promise<ListResponse<TaskResult>> => {
    const tasks = await taskRepository.findAllTaskByProjectId(payload)

    const rows: TaskResult[] = []
    for (const t of tasks) {
        const temp = composeTask(t)
        rows.push(temp)
    }

    return {
        metadata: null,
        rows,
    }
}

export const updateTask = async (payload: UpdatePayload<TaskPayload>) => {
    const { data } = payload
    const id = data.id as string

    // validate startTime should smaller than endTime
    validateTimeOfTask(data.startTime, data.endTime)

    // validate task overlap in project
    await validateSameStartTime({
        projectId: data.projectId,
        startTime: data.startTime,
    })

    // determine task by id
    const task = await taskRepository.findTaskById(id)
    if (!task) {
        throw new HttpException(`task doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    // validate task is already done cant be changed
    validateTaskIsDone(task.doneAt)

    // persist update task
    await taskRepository.updateTaskById(task._id.toString(), {
        description: data.description,
        title: data.title,
        startTime: dateUtil.StringISOToJSDate(data.startTime),
        endTime: dateUtil.StringISOToJSDate(data.endTime),
    })

    Object.assign(task, data)
    return composeTask(task)
}

export const deleteTask = async (payload: TaskDetailPayload) => {
    const { id } = payload

    // determine task by id
    const task = await taskRepository.findTaskById(id)
    if (!task) {
        throw new HttpException(`task doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    await taskRepository.deleteTaskById(task._id.toString())
}

export const markAsDoneTask = async (payload: TaskDetailPayload): Promise<TaskResult> => {
    const { id } = payload

    // determine task by id
    const task = await taskRepository.findTaskById(id)
    if (!task) {
        throw new HttpException(`task doesn't exist on database`, HttpStatus.NOT_FOUND)
    }

    if (task.doneAt) {
        throw new HttpException(`task already done`, HttpStatus.BAD_REQUEST)
    }

    const data = {
        doneAt: dateUtil.Now(),
    }
    await taskRepository.updateTaskById(task._id.toString(), data)

    Object.assign(task, data)
    return composeTask(task)
}
