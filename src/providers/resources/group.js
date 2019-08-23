import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    fetchJson
} from '@dgtx/coreui';
import { API_ENDPOINT,APP_NAME } from '../../constants'
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if (type === GET_LIST) {
        option.method = 'GET'
        uri = `${API_ENDPOINT}/apps/${APP_NAME}/groups`
    } else if (type === CREATE) {
        option.method = 'POST'
        uri = `${API_ENDPOINT}/apps/${APP_NAME}/groups`
        option.body = JSON.stringify(params)
    }
    else if (type === UPDATE) {
        option.method = 'PATCH'
        uri = `${API_ENDPOINT}/apps/${APP_NAME}/groups`
        option.body = JSON.stringify(params)
    }
    return fetchJson(uri, option)
};

