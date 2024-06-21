const schema = {
    createProject: {
        name: 'string|required',
        description: 'string|required|min:1',
    },
    updateProject: {
        id: 'string|required|objectID',
        name: 'string|required',
        description: 'string|required|min:1',
    },
}
export const ProjectValidation = schema
