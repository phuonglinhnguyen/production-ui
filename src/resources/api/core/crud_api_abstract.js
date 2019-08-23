import APIAbstract from './api_abstract';

export default class CRUDApi extends APIAbstract {
    constructor(conn, api_url) {
        super(conn);
        this._api_url = api_url;
    }
    get = (id) => {
        return this._conn.get(`${this._api_url}/${id}`)
    }
    list = () => {
        return this._conn.get(`${this._api_url}`)
    }
    add = (data) => {
        return this._conn.post(`${this._api_url}`, data);
    }
    update = (id, data) => {
        return this._conn.patch(`${this._api_url}/${id}`, data);
    }
    replay = (id, data) => {
        return this._conn.put(`${this._api_url}/${id}`, data);
    }
    delete = async (id) => {
        return await this._conn.delete(`${this._api_url}/${id}`);
    }
}