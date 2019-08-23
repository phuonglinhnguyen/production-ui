import { INFO, JOIN_ROOM_REJECT } from '../middlewares/SocketIO'
const initialState = {
    info:null,
    isRejectRoom:false,
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case INFO:
            return { ...state, info: payload }
        case JOIN_ROOM_REJECT:
            return { ...state,isRejectRoom:true}
        default:
            return state
    }
}
