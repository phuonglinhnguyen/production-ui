import { CREATE, FETCH_END, CRUD_CREATE } from '@dgtx/coreui'

const ACTION_NOTIFICATION = '@@ANOUNCEMENT/NOTIFICATION'
export const ACTION_NOTIFICATION_SHOW = '@@ANOUNCEMENT/NOTIFICATION/SHOW'
export const ACTION_NOTIFICATION_HIDE = '@@ANOUNCEMENT/NOTIFICATION/HIDE'
export default ({ dispatch, getState }) => (next: Function) => (action) => {
    if (action.type === ACTION_NOTIFICATION) {
        dispatch({
            type: `${CRUD_CREATE}/SUCCESS`,
            payload: { json: action.payload },
            meta: {
                resource: 'announcement',
                refresh: false,
                fetchResponse: CREATE,
                fetchStatus: FETCH_END,
            }
        })
        dispatch({ type: ACTION_NOTIFICATION_SHOW, payload: action.payload })
    }
    return next(action)
}