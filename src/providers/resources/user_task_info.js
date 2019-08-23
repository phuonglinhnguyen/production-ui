import {
   GET_ONE,
   fetchJson
} from '@dgtx/coreui';
import { API_ENDPOINT,REPORT_ENDPOINT, APP_NAME } from '../../constants'

export default (type, resource, params) => {
   switch (type) {
       case GET_ONE: {
           const { projectId, taskKeyDef } = params;
           return fetchJson(`${REPORT_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/overall-working-daily-report`,
               { method: 'GET'})
           break;
       }
       default:
           break;
   }
   return Promise.reject(`Provider ${resource} method:${type} not yet supported!`)
};