const transFormExcludesToString = (excludes) => {
    try {
        let datas = excludes.map(item => {
            return `${item.configurationName}:${item.excludes.join('|')}`
        })
        return datas.join(',')
    } catch (error) {
        return '';
    }

}
const CONFIGURATIONS = [
    'field_value_definitions',
    'layout_definitions',
    'section_definitions',
    'acquisitors',
    'upload_configurations',
    'project_workflow',
    'response_evaluations',
    'project_users',
    'export_configurations'
]
export default class IOConfiguration {
    constructor(conn) {
        this._conn = conn;
        this._api_url = 'io-configurations'
    }
    get_info_configurations = (projectId) => {
        return this._conn.get(`projects/${projectId}/${this._api_url}?configurations=${CONFIGURATIONS.join(',')}`)
    }
    get_export_configurations = (projectId, collections, excludes) => {
        let excludeString = transFormExcludesToString(excludes)
        let excludeRequest = excludeString.length ? `&&excludes=${excludeString}` : ''
        return this._conn.get(`projects/${projectId}/${this._api_url}?data_type=export&&configurations=${collections.join(',')}${excludeRequest}`)
    }
    import_configurations = (projectId, data, collections) => {
        return this._conn.patch(`projects/${projectId}/${this._api_url}?configurations=${collections.join(',')}&&data_type=count`, { type: 'json', data });
    }
    clone_configurations = (projectId, propjectIdrefer, collections, excludes) => {
        let excludeString = transFormExcludesToString(excludes)
        let excludeRequest = excludeString.length ? `&&excludes=${excludeString}` : ''
        return this._conn.patch(`projects/${projectId}/${this._api_url}/clone_from/${propjectIdrefer}?configurations=${collections.join(',')}&&data_type=count${excludeRequest}`, {});
    }
}

