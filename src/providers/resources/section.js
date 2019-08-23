import {
    GET_LIST,
    fetchJson
} from '@dgtx/coreui';
import {
    API_ENDPOINT,
    APP_NAME
} from '../../constants'
export default (type, resource, params) => {
    switch (type) {
        case GET_LIST: {
            const { projectId, layoutName } = params;
            if (layoutName) {
                return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/section-definitions?layout_name=${layoutName}&attributes=position,visible,disable,double_typing`,
                    { method: 'GET' })
            }
            break;
        }
        default:
            break;
    }
    return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

