import { APP_NAME , BPMN_ENDPOINT } from '../../../constants'

export default class Task {
    constructor(conn) {
        this._conn = conn;
    }
    get = (projectId,taskId) => {
        return this._conn.get(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}`)
    }
    claim = (projectId, taskId, username) => {
        return this._conn.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}/claim`, { user_name: username });
    }
    claim_next = (projectId, processKey, taskDefkey, username) => {
        return this._conn.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/process-definition/key/${processKey}/tasks/key/${taskDefkey}/claim`, { user_name: username });
    }
    claim_next_max = (projectId, processKey, taskDefkey, username, maxResult) => {
        return this._conn.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/process-definition/key/${processKey}/tasks/key/${taskDefkey}/claim?maxResult=${maxResult}`, { user_name: username });

    }
    claim_multi = async (
        processKey: String,
        taskDefId: String,
        maxResult: Number,
        groupBy: String,
        filterKey: String,
        filterOperator: String,
        filterValue: String,
        sortingBy: String,
        userName: String) => {
        return this._conn.patch(`workflow/tasks/${processKey}/${taskDefId}/claim?maxResult=${maxResult}&groupBy=${groupBy}&filteringBy=${filterKey},${filterOperator},${filterValue}&sortingBy=${sortingBy}`, { user_name: userName });

    }
    complete = (projectId, taskId, data) => {
        return this._conn.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}/complete`, data);
    }
    complete_multi = (projectId, data) => {
        return this._conn.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/complete`, data);
    }
}