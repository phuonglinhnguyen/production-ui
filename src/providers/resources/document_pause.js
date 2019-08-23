import {
   GET_LIST,
   GET_ONE,
   CREATE,
   UPDATE,
   fetchJson
} from '@dgtx/coreui';
import { API_ENDPOINT, APP_NAME, BPMN_ENDPOINT } from '../../constants'
export default (type, resource, params) => {
   switch (type) {
      case GET_ONE: {
         const { projectId, taskId, username } = params;
         return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/document-pause/${taskId}/${username}/lasted`, { method: 'GET' });
      }
      case UPDATE: {
         const { projectId, taskId, username, data } = params;
         return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/document-pause/${taskId}/${username}`,
            { method: 'POST', body: JSON.stringify(data) });
      }
      default:
         break;
   }
   return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

