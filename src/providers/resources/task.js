import {
    GET_LIST, //eslint-disable-line
    GET_ONE,
    fetchJson
} from '@dgtx/coreui';
import { UAC_ENDPOINT } from '../../constants'
export default (type, resource, params) => {
    if (type === GET_ONE) {
        return fetchJson(`${UAC_ENDPOINT}/apps/production/projects/${params.projectId}/tasks`, { method: 'GET' })
    }
    return Promise.reject(`Task Provider Not yet support type ${type}`)
};

