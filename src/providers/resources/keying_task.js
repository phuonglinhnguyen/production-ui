import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    fetchJson
} from '@dgtx/coreui';
import { API_ENDPOINT, APP_NAME, BPMN_ENDPOINT } from '../../constants'

export default (type, resource, params) => {
    switch (type) {
        case GET_ONE: {
            const { claim, projectId, taskKeyDef, username } = params;
            return fetchJson(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/process-definition/key/start/tasks/key/${taskKeyDef}/claim`,
                { method: 'PATCH', body: JSON.stringify({ user_name: params.username }) })
            break;
        }
        case UPDATE: {
            const { projectId, taskId, data } = params;
            return fetchJson(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}/complete`, { method: 'PATCH', body: JSON.stringify(data) })
            // return fetchJson(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}/complete--test-failed`, { method: 'PATCH', body: JSON.stringify(data) })
        }
        default:
            break;
    }
    return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

