import { 
    GET_LIST, //eslint-disable-line
    GET_ONE, 
    fetchJson 
} from '@dgtx/coreui';
import { API_ENDPOINT } from '../../constants'
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if (type === GET_ONE) {
        option.method = 'GET'    
        uri =  `${API_ENDPOINT}/user/${params.username}` 
    }
    return fetchJson(uri, option)
};

