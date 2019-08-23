import {
   UPDATE,
   fetchJson
} from '@dgtx/coreui';
import { API_ENDPOINT, APP_NAME } from '../../constants'
export default (type, resource, params) => {
   switch (type) {
      case UPDATE: {
         const { projectId, docId, taskKeyDef } = params;
         return fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/rework-doc-details/${docId}`,
            {
               method: 'PATCH', body: JSON.stringify({ "task_def": taskKeyDef })}
            );
      }
      default:
         break;
   }
   return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};

