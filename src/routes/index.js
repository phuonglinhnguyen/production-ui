export { default as routeProvider  } from './routeProvider'

export const getPaths = () => {
    return [
        '/keying/:projectId/:layoutName/:sectionName/:taskId+',
        '/keyings/:projectId/:layoutName/:sectionName/:taskId+',
        '/mixed-keyings/:projectId/:layoutName/:taskId+',
        '/batch-allocation/:projectId/0/0/:taskKeyDef',
        '/classifying/:docSize/false/:projectId/:batchId/:docId/:taskKeyDef+',
        '/classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+',
        '/re-classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+',
        '/verifying/classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+',
        '/omr/:projectId/:layout_name/:section_name/:task_def_key+',
        '/:verifying/omr/:projectId/:layout_name/:section_name/:task_def_key+',
        '/verifying/key/:projectId/:layoutName/:sectionName/:taskKeyDef+',
        '/invoice/:projectId/:action/:layoutName/:taskKeyDef+',
        '/verifying/hold/:docSize/true/:projectId/:taskKeyDef+',
        '/rework/projects/:projectId/:taskKeyDef+',
        '/data/:action/:projectId/:taskKeyDef+',
        '/projects/:projectId',
    ]
}
