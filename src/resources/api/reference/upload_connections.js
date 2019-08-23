export default class UploadConnections {
    constructor(conn) {
        this._conn = conn;
    }
    test = (config) => {
        return this._conn.post(`upload-connections-test`,config)
    }
}