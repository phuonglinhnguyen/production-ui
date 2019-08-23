import clone from 'clone'
import { PROJECT_ITEM_RECEIVE_DATA, PROJECT_ITEM_REQUEST_DATA } from '../actions/project_item'

const initial_project = {
    id: '0',
    name: '',
    priority: 1,
    customer: '',
    active: true,
    group_id: null,
    group_name: ''
};

const initialState = {
    is_error: false,
    is_fetching: false,
    project: { ...initial_project },
    project_modify: null,
    groups: []

};
export default (state=clone(initialState),action)=>{
    switch (action.type) {
        case PROJECT_ITEM_REQUEST_DATA:
          return {
            ...state,
            project:{...initial_project},
            is_fetching: true
          };
        case PROJECT_ITEM_RECEIVE_DATA:
          return {
            ...state,
            project: action.project,
            is_error: action.is_error,
            is_fetching: false
          };
        default:
          return state;
      }
};