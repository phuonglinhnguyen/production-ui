export default class Task {
    constructor(conn) {
        this._conn = conn;
    }
    generate=(projectId, taskId, username)=>{
        return this._conn.post(`training/projects/${projectId}/task_defs/${taskId}/generate`,{"user_name":username})
    }
    claim_next = (projectId, taskId, username) => {
        return this._conn.patch(`training/projects/${projectId}/task_defs/${taskId}/claim`, { "user_name": username });
    }
    complete = (id,doc_id, data) => {
        return this._conn.patch(`training/${id}/documents/${doc_id}/complete`);
    }
    // complete_multi = (id, data) => {
    //     return this._conn.patch(`training/tasks/complete`, data);
    // }
}