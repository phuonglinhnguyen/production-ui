import clone from 'clone';
import { MESSAGE_ACTION } from './action_creator';
const notificationInitialState = {
    messages: []
}
export default (state = notificationInitialState, action) => {
    switch (action.type) {
        case MESSAGE_ACTION.ADD_NOTIFICATION: {
            let _message = clone(state.messages);
            _message.unshift(action.payload);
            return {
                ...state,
                messages: _message,
            }
        }
        case MESSAGE_ACTION.REMOVE_MESSAGE: {
            // let _message = clone(state.messages);
            // if (!action.index) {
            //     _message.unshift(action.payload);
            // } else {
            //     _message = _message.filter((item, index) => index !== action.index);
            // }
            return {
                ...state,
                messages: [],
            }
        }
        default:
            return state;
    }
}