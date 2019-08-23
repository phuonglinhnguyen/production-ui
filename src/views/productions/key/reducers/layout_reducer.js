import { LayoutTypes, RESET_ALL } from '../types';

const initialState = {
    didInvalidate: 0,
    isFetching: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LayoutTypes.FETCHING:
            return {
                ...state,
                isFetching: true,
            };
        case LayoutTypes.DID_INVALIDATION:
            return {
                ...state,
                didInvalidate: state.didInvalidate + 1,
                isFetching: false,
            };
        case LayoutTypes.RECEIVE:
            return {
                ...state,
                item: action.payload,
                didInvalidate: 0,
                isFetching: false,
            };

        case RESET_ALL:
        case LayoutTypes.RESET:
            return initialState;
        default:
            return state;
    }
}
