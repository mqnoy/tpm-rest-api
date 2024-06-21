import express from 'express'
import { HttpStatus } from '../../enums'
import { taskUseCase } from '../usecase'
import { TaskDetailPayload, TaskPayload, TaskResult, UpdatePayload } from '../../dto'
import { validatorUtil } from '../../utils'
import { TaskValidation } from '../../validation'
import ResponseCustom from '../../pkg/express/response'

export const route = express.Router()

route.put(
    '/tasks/:id',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const body = req.body as TaskPayload
            body.id = req.params.id

            // validate request body
            await validatorUtil.validator(body, TaskValidation.updateTask)

            const payload: UpdatePayload<TaskPayload> = {
                data: {
                    id: body.id,
                    ...body,
                },
            }

            // call useCase
            const data = await taskUseCase.updateTask(payload)

            // wrap response
            return new ResponseCustom<TaskResult>(
                'update task successfully',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.delete(
    '/tasks/:id',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const payload: TaskDetailPayload = {
                id: req.params.id,
            }

            // call useCase
            await taskUseCase.deleteTask(payload)

            // wrap response
            return new ResponseCustom<unknown>(
                'delete task successfully',
                null,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.patch(
    '/tasks/:id/done',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const payload: TaskDetailPayload = {
                id: req.params.id,
            }

            // call useCase
            const data = await taskUseCase.markAsDoneTask(payload)

            // wrap response
            return new ResponseCustom<TaskResult>(
                'mark as done task successfully',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)
