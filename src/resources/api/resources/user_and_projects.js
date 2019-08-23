export default class UserAndProject {
    constructor(conn) {
        this._conn = conn;
        this._api_url = 'users/projects'
    }
    get_users_of_project = (projectId) => {
        return this._conn.get(`${this._api_url}/${projectId}`)
    }
    get_user_task_of_project = (projectId) => {
        return this._conn.get(`${this._api_url}/${projectId}/tasks`)
    }
}