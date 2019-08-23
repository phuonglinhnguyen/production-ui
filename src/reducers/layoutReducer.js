import { KEY_STORAGE_THEME } from '../constants'
import { CHANGE_THEME, LAYOUT_CHANGE_VALUE_ITEM } from '../constants/actionTypes'
import { ACTION_NOTIFICATION_SHOW, ACTION_NOTIFICATION_HIDE } from '../middlewares/announcement';
const initialState = {
    theme_name: localStorage.getItem(KEY_STORAGE_THEME),
    showNotification: false,
    notify: {}
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_THEME:
            localStorage.setItem(KEY_STORAGE_THEME, payload)
            return { ...state, theme_name: payload }
        case LAYOUT_CHANGE_VALUE_ITEM:
            return { ...state, ...payload }
        case ACTION_NOTIFICATION_SHOW: {
            return {
                ...state,
                showNotification:true,
                notify: payload
            }
        }
        case ACTION_NOTIFICATION_HIDE:{
            return {
                ...state,
                showNotification:false,
            }
        }
        default:
            return state
    }
}
