import {
    GET_LIST,
    GET_ONE,//eslint-disable-line
    fetchJson
} from '@dgtx/coreui';
import { UAC_ENDPOINT, BPMN_ENDPOINT } from '../../constants'
export default (type, resource, params) => {
    if (type === GET_LIST) {
        const excute = async () => {
            let taskCalled = fetchJson(`${UAC_ENDPOINT}/apps/production/projects/${params.project_id}/tasks`, { method: 'GET' });
            let taskRemain;
            let mapRemain = {};
            try {
                taskRemain = await fetchJson(`${BPMN_ENDPOINT}/apps/production/projects/${params.project_id}/remain-human-tasks`, { method: 'GET' });
                taskRemain.json.remain_tasks.forEach(item => {
                    mapRemain[item.form_uri] = item.instances
                })
            } catch (error) {
            }
            let task = await taskCalled;
            return { ...task, json: task.json.map(item => ({ ...item, title: item.name, instances: mapRemain[item.form_uri] || 0 })) }
        }
        return excute()
        // return fetchJson(`${API_ENDPOINT}/workflow/definitions/${params.project_id}/user_task_statistic`, { method: 'GET' })
    }
    return Promise.reject(`task-info Provider Not support ${type}`)

};

