export default class RecentData {
    constructor(conn) {
        this._conn = conn;
    }
    set_resent_data = (username,task_id, data) => {
        return this
            ._conn
            .post(`recent-data`, {task_id, data})
    }
    get_resent_data = (username) => {
        return this
            ._conn
            .get(`recent-data`)
    }
}