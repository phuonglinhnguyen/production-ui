import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    fetchJson
} from '@dgtx/coreui';
import { UAC_ENDPOINT } from '../../constants'
const RESOURCE_ENDPOINT =`${UAC_ENDPOINT}/users`
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if (type === GET_LIST) {
        option.method = 'GET';
        uri = `${RESOURCE_ENDPOINT}`;
    } 
    return fetchJson(uri, option)
};

