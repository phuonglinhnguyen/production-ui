import clone from 'clone'
import * as types from '../constants/project_guide_view_contant';

const initialState = {
    successProjectGuideView: false,
    pendingProjectGuideView: false,
    errorProjectGuideView: false,
    data: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.PROJECT_GUIDE_VIEW_GET_DATA:
            return {
                ...state,
                ...action.payload
            }
        case types.PENDING:
            return {
                ...state,
                ...action.payload
            }
        case types.ERROR:
            return {
                ...state,
                ...action.payload
            }
        case types.SUCCESS:
            return {
                ...state,
                ...action.payload
            }
        case types.RESET:
            return {
                ...state,
                ...action.payload
            }
        case types.RESET_ALL:
            return clone(initialState)
        default:
            return state
    }
}