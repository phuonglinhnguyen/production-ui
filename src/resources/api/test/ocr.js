// import { API_OCR } from '../../../../constants'
export default class OCR {
    constructor(conn) {
        this._conn = conn;
    }
    // get_by_path = (path,type) => {
    //     return this
    //         ._conn
    //         .post(`${API_OCR}/try-ocr?${type}=${path}`)
    // }
    // get_by_base64 = (base64) => {
    //     return this
    //         ._conn
    //         .post(`${API_OCR}/try-ocr`, {base64}) //TODO add config on root
    // }
}