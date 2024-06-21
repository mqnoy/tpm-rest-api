const schema = {
    id: {
        id: 'string|required',
    },
    createTask: {
        projectId: 'string|required|empty:false|objectID',
        title: 'string|required|empty:false',
        description: 'string|required|empty:false',
        startTime: 'isoDate',
        endTime: 'isoDate',
    },
    updateTask: {
        title: 'string|required|empty:false',
        description: 'string|required|empty:false',
        startTime: 'isoDate|required',
        endTime: 'isoDate|required',
    },
}

export const TaskValidation = schema
