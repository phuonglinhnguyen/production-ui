import { fetchJson } from '../utils/fetch';
import { GET_LIST, GET_ONE } from '../store';

export default (type, resource, params) => {
    let uri='';
    let option ={};
    if(type===GET_ONE){
        option['headers'] = new Headers({method: 'GET'})
        uri=`/api/workflow/definitions/${params.project_id}/user_task_statistic`
    }
    return fetchJson(uri, option)
};

