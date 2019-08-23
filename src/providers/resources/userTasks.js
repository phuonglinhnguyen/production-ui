import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
} from '@dgtx/coreui';
import { fetchJson } from '../mocks'
import { API_ENDPOINT, APP_NAME } from '../../constants'
export default (type, resource, params) => {
    if (type === GET_LIST) {
        return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${params.id}/tasks`, {method:'GET'})
    }
    return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

