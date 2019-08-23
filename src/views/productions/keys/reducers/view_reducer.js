import {
    ViewTypes,
    RESET_ALL
} from '../types';
const initialState = {
    isNext: !0,
    focusPosition: null,
    view_records: false,
}
export default (state = initialState, action) => {
    switch (action.type) {
        case ViewTypes.CHANGE_NEXT:
            return {
                ...state,
                isNext: action.next
            }
        case ViewTypes.FOCUS_POSITION:
            return {
                ...state,
                focusPosition: action.position
            }

        case ViewTypes.SET_VIEW_RECORDS:
            return {
                ...state,
                view_records: action.view
            }



        case RESET_ALL:
            return initialState;
        default:
            return state
    }
}