import { combineReducers } from 'redux'
import {
    INIT_DATA_DASHBOARD,
    DASHBROAD_CHANGE_VALUE_ITEM,
} from './Dashboard.actions'
export default {
    name: 'dashboard',
    reducer: (state = {
        user: {},
        group_ids: [],
        project_ids: [],
        project_id: '',
        group_id: '',
        showGroup: false,
        project_tasks: [],
    }, { type, payload, meta }) => {
        if (type === INIT_DATA_DASHBOARD) {
            return {
                ...payload
            }
        } else if (type === DASHBROAD_CHANGE_VALUE_ITEM) {
            return {
                ...state,
                ...payload
            }
        }
        return state;
    }
}




