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
        case UPDATE: {
            const { projectId, taskId, documentId, records } = params;
            return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/documents?id=${documentId}&multiple=true`,
                { method: 'PATCH', body: JSON.stringify(records) });
        }
        default: 
            break;
    }
    return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

