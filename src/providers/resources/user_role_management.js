import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    fetchJson
} from '@dgtx/coreui';
import { API_ENDPOINT } from '../../constants'



const RESOURCE_ENDPOINT =`@${API_ENDPOINT}/user`
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if (type === GET_ONE) {
        option.method = 'GET';
        uri = `${RESOURCE_ENDPOINT}?username=${params.username}`;
    } else if (type === CREATE) {
        option.method = 'POST';
        option.body = JSON.stringify(params)
        uri = `${RESOURCE_ENDPOINT}`
    }
    else if (type === UPDATE) {
        let  {id,...body} = params;
        option.method = 'PATCH';
        uri = `${RESOURCE_ENDPOINT}/${id}`
        option.body = JSON.stringify(body)
    }
    return fetchJson(uri, option)
};

