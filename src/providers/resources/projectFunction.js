import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    fetchJson
} from '@dgtx/coreui';
import { UAC_ENDPOINT, APP_NAME } from '../../constants'
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if (type === GET_LIST) {
        option.method = 'GET'
        uri = `${UAC_ENDPOINT}/apps/${APP_NAME}/projects/${params.id}/functions`
        return fetchJson(uri, option)
    }
    return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

