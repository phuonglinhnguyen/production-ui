export default class Report {
    constructor(conn) {
        this._conn = conn;
    }
    daily_log = (projectid) => {
        return this._conn.get(`/reports/daily-log/${projectid}`)
    }
    working_histories = (projectid) => {
        return this._conn.get(`/reports/${projectid}/user/working`)
    }
}

//https://sit-elrond.digi-texx.vn/api