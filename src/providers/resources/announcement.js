import {
    GET_LIST,
    CREATE,
    UPDATE,
    fetchJson
} from '@dgtx/coreui';
import {
    API_ENDPOINT,
    APP_NAME,
    API_SOCKET
} from '../../constants'
export default (type, resource, params) => {
    switch (type) {
        case GET_LIST:
            return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/announcements?username=${params.username}`, { method: 'GET' });
        case UPDATE:
        const excute = async (params) => {
            let result = await  fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/announcements/${params.id}/read`, { method: 'PATCH', body: JSON.stringify({username:params.username}) });
            result.json ={...result.json, ...params.data};
            return result;
        }     
        return excute(params);
        default:
            break;
    }
    return Promise.reject(`Announcement Provider Not support ${type}`)
};

