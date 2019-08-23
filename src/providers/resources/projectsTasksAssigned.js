import {
    GET_LIST,
    GET_ONE,
    UPDATE,
    CREATE,
    fetchJson
} from '@dgtx/coreui';
import {
    API_ENDPOINT,
    APP_NAME,
    UAC_ENDPOINT,
} from '../../constants'
/**
 * 
 * @returns Promise({headers, json, body, status})
 */
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if (type === GET_LIST) {
        option.method = 'GET'
        if (params.group_id === 'all') {
            uri = `${API_ENDPOINT}/apps/${APP_NAME}/projects`
        } else {
            uri = `${API_ENDPOINT}/apps/${APP_NAME}/projects?group_id=${params.group_id}`
        }
        const excute = async  () => {
            return await fetchJson(uri, option);
        }
        return excute();
    }
    return Promise.reject(`projectProvider Not support ${type}`)
};

