export default class DocumentTraining {
    constructor(conn) {
        this._conn = conn;
    }
    add_records_keyed_data = (traning_id, documentId, records: Array<Object>) => {
       // TODO wait implement api
        return this._conn.patch(`training/${traning_id}/documents/${documentId}?attributes=keyed_data`, records);
    }
}