import CRUDApi from '../core/crud_api_abstract';
export default class UploadConfiguration  extends CRUDApi{
    constructor(conn) {
        const api_url = 'upload-configurations';
        super(conn, api_url)
    }
    list_of_project = (id) => {
        return this._conn.get(`projects/${id}/${this._api_url}`)
    }
}