import CRUDApi from '../core/crud_api_abstract';
import { APP_NAME } from '../../../constants'

export default class Field extends CRUDApi {
    constructor(conn) {
       const api_url =  `apps/${APP_NAME}/field-value-definitions`;
        super(conn,api_url)
    }
    list_of_section = (projectId, sectionId) => {
        return this._conn.get(`apps/${APP_NAME}/projects/${projectId}/field-value-definitions?section_id=${sectionId}`)
    }
    list_of_section_by_layout = (projectId, layoutName, sectionName, position = 1) => {
        return this._conn.get(`apps/${APP_NAME}/projects/${projectId}/field-value-definitions?layout_name=${layoutName}&section_name=${sectionName}&position=${position}`)
    }
    list_of_sections = (projectId, sectionIds) => {
        return this._conn.get(`apps/${APP_NAME}/projects/${projectId}/field-value-definitions?section_id=${sectionIds.join(',')}`)
    }
    list_of_layout = (id) => {
        return this._conn.get(`apps/${APP_NAME}/layout-definitions/${id}/field-value-definitions`)
    }
    list_of_project = (id) => {
        return this._conn.get(`apps/${APP_NAME}/projects/${id}/field-value-definitions`)
    }
    list_field_has_structure_by_layout_name=(projectId, layoutName)=>{
        return this._conn.get(`apps/${APP_NAME}/projects/${projectId}/field-value-definitions?layout_name=${layoutName}`)
    } 
}

