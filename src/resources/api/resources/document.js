import { APP_NAME } from "../../../constants";

export default class Document {
    constructor(conn) {
        this._conn = conn;
    }
    get = (projectId,documentId) => {
        return this._conn.get(`/apps/${APP_NAME}/projects/${projectId}/documents/${documentId}`)
    }
    data_node_of_docs=(projectId, docIds, dataNodeName)=>{
        return this._conn.get(`/apps/${APP_NAME}/projects/${projectId}/documents?ids=${docIds}&attributes=records.${dataNodeName}&position=last`)
    }
    add_records_keyed_data = (projectId, documentId, records: Array<Object>) => {
        return this._conn.patch(`/apps/${APP_NAME}/projects/${projectId}/documents?id=${documentId}&multiple=true`, records);
        // return this._conn.patch(`projects/${projectId}/documents?id=${documentId}&attributes=keyed_data`, records);
    }
    add_records_qc_data = (projectId, documentId, records: Array<Object>) => {
        return this._conn.patch(`/apps/${APP_NAME}/projects/${projectId}/documents?id=${documentId}&attributes=qc_data`, records);
    }
    reworked_doc =(projectId, documentId, taskDef) => {
        return this._conn.patch(`/apps/${APP_NAME}/projects/${projectId}/rework-details/${documentId}`, {"task_def":taskDef});
    }
   
}

