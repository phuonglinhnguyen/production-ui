import {
    GET_LIST,
    GET_MANY,
    GET_ONE,
    GET_COUNT,
    UPDATE,
    CREATE,
    fetchJson,
} from '@dgtx/coreui';
import {
    API_ENDPOINT,
    APP_NAME
} from '../../constants'
export default (type, resource, params) => {
    let uri = '';
    let option = { method: 'GET' };
    if (type === GET_LIST) {
        uri = `${API_ENDPOINT}/apps/${APP_NAME}/documents/remain`
        return fetchJson(uri, option)
    } else if (type === GET_COUNT) {
        uri = `${API_ENDPOINT}/apps/${APP_NAME}/documents/count`
        return fetchJson(uri, option)
    }
    return Promise.reject(`remainDocumentProvider Not support ${type}`)
};

