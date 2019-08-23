import {
    GET_LIST,
    GET_ONE,
    UPDATE,
    CREATE,
    fetchJson,
    getApiURI,
    getAppName
} from '@dgtx/coreui';
export default (type, resource, params) => {
    let uri = '';
    let option = {};
    if(type===GET_ONE){
        return fetchJson(`${getApiURI()}/apps/${getAppName()}/projects/${params.id}`, {method:"GET"})
    }else
    if (type === GET_LIST) {
        option.method = 'GET'
        if (params.group_id === 'all') {
            uri = `${getApiURI()}/apps/${getAppName()}/projects`
        } else {
            uri = `${getApiURI()}/apps/${getAppName()}/projects?group_id=${params.group_id}`
        }
        return fetchJson(uri, option)
    } else if (type === UPDATE) {
        option.method = 'PATCH'
        uri = `${getApiURI()}/apps/${getAppName()}/projects/${params.id}`
        params.data.id = undefined
        option.body = JSON.stringify(params.data)
        return fetchJson(uri, option)
    }
    else if (type === CREATE) {
        option.method = 'POST'
        uri = `${getApiURI()}/apps/${getAppName()}/projects`;
            option.body = JSON.stringify(params.data)
        return fetchJson(uri, option)
    }
    return Promise.reject(`projectProvider Not support ${type}`)
};

