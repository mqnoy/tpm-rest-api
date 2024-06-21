import express from 'express'
import { HttpStatus } from '../../enums'
import { projectUseCase } from '../usecase'
import {
    ListPayload,
    ListResponse,
    ProjectDetailPayload,
    ProjectPayload,
    ProjectResult,
    ProjectTaskPayload,
    TaskPayload,
    TaskResult,
    UpdatePayload,
} from '../../dto'
import { FilterKeys } from '../../constans'
import { ParseQueryFilters } from '../../pkg/express/request'
import { validatorUtil } from '../../utils/'
import ResponseCustom from '../../pkg/express/response'
import { ProjectValidation, TaskValidation } from '../../validation'

export const route = express.Router()

route.post(
    '/projects',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const body = req.body as ProjectPayload

            // validate request body
            const payload: ProjectPayload = {
                ...body,
            }
            await validatorUtil.validator(payload, ProjectValidation.createProject)

            // call useCase
            const data = await projectUseCase.createProject(payload)

            // wrap response
            return new ResponseCustom<ProjectResult>(
                'create project successfully',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.get(
    '/projects',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const payload: ListPayload = {
                filters: ParseQueryFilters(req),
            }

            // call useCase
            const data = await projectUseCase.listProjects(payload)

            // wrap response
            return new ResponseCustom<ListResponse<ProjectResult>>(
                'list project',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.get(
    '/projects/:id',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const payload: ProjectDetailPayload = {
                id: req.params.id,
            }

            // call useCase
            const data = await projectUseCase.detailProject(payload)

            // wrap response
            return new ResponseCustom<ProjectResult>(
                'detail project',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.put(
    '/projects/:id',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const body = req.body as ProjectPayload

            const payload: UpdatePayload<ProjectPayload> = {
                data: {
                    id: req.params.id,
                    ...body,
                },
            }

            // validate request body
            await validatorUtil.validator(payload.data, ProjectValidation.updateProject)

            // call useCase
            const data = await projectUseCase.updateProject(payload)

            // wrap response
            return new ResponseCustom<ProjectResult>(
                'update project successfully',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.delete(
    '/projects/:id',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const payload: ProjectDetailPayload = {
                id: req.params.id,
            }

            // call useCase
            await projectUseCase.deleteProject(payload)

            // wrap response
            return new ResponseCustom<unknown>(
                'delete project successfully',
                null,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.post(
    '/projects/:id/tasks',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const body = req.body as TaskPayload
            body.projectId = req.params.id

            // validate request body
            await validatorUtil.validator(body, TaskValidation.createTask)

            const payload: ProjectTaskPayload = {
                projectId: body.projectId,
                task: body,
            }

            // call useCase
            const data = await projectUseCase.createProjectTask(payload)

            // wrap response
            return new ResponseCustom<TaskResult>(
                'create project task successfully',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)

route.get(
    '/projects/:id/tasks',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const payload: ListPayload = {
                filters: ParseQueryFilters(req),
            }

            // call useCase
            payload.filters[FilterKeys.projectId] = req.params.id
            const data = await projectUseCase.listProjectTasks(payload)

            // wrap response
            return new ResponseCustom<ListResponse<TaskResult>>(
                'list tasks in project',
                data,
                HttpStatus.OK
            ).wrapResponse(res)
        } catch (error) {
            next(error)
        }
    }
)
