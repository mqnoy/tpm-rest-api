import { DateTime } from 'luxon'
import { Project, Task } from '../src/model/index'

export async function up(): Promise<void> {
    const project = new Project({
        name: 'Examplemigration',
        description: 'example project from migration',
    })
    await project.save()

    const startTime = DateTime.utc()
    const task = new Task({
        title: 'setup codebase',
        description: 'initial codebase for app',
        startTime: startTime.toJSDate(),
        endTime: startTime.plus({ day: 1 }),
        doneAt: null,
        project: project,
    })
    await task.save()
}

export async function down(): Promise<void> {
    await Project.deleteMany({ name: { $in: ['Examplemigration'] } }).exec()
}
