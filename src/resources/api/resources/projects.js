import CRUDApi from '../core/crud_api_abstract';
export default class Projects extends CRUDApi{
    constructor(conn) {
        const api_url = 'projects'
         super(conn,api_url)
     }
}