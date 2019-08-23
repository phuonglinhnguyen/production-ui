import { ADD , RESET } from '../types/storage_types';
export default (state = {}, action) => {
    switch (action.type) {
        case ADD:
            return {
                ...state,
                ...action.record};
        case RESET: return {};    
        default: return state;
    }
};