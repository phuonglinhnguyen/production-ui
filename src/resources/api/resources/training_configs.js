import CRUDApi from '../core/crud_api_abstract';
export default class TrainingConfig extends CRUDApi{
    constructor(conn) {
        const api_url = 'training-configs'
         super(conn,api_url)
     }
    
}