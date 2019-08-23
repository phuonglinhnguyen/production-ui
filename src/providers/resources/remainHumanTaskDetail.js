import {
    GET_LIST,
    GET_MANY,
    GET_ONE,
    GET_COUNT,
    UPDATE,
    CREATE,
    fetchJson,
    quey
} from '@dgtx/coreui';
import {
    BPMN_ENDPOINT,
    APP_NAME
} from '../../constants'
export default (type, resource, params) => {
    let uri = '';
    let option = { method: 'GET' };
    if (type === GET_MANY) {
        uri = `${BPMN_ENDPOINT}/apps/${APP_NAME}/workflow/remain-human-tasks`
        return fetchJson(uri, option)
    } else if (type === GET_COUNT) {
        uri = `${BPMN_ENDPOINT}/apps/${APP_NAME}/workflow/remain-human-tasks/count`
        return fetchJson(uri, option)
    }
    return Promise.reject(`remain-human-tasksProvider Not support ${type}`)
};

