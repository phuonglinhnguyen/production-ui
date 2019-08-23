export const MESSAGE_ACTION = {
    ADD_NOTIFICATION: 'NOTIFICATION_ADD',
    REMOVE_MESSAGE: 'NOTIFICATION_REMOVE'
}
export const MESSAGE_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
}

export function addMessage(type, title, message, options) {
    return { type: MESSAGE_ACTION.ADD_NOTIFICATION, payload: { type, title, message, options } }
}

export function info(title, message, options) {
    return addMessage(MESSAGE_TYPES.INFO, title, message, options);
}
export function success(title, message, options) {
    return addMessage(MESSAGE_TYPES.SUCCESS, title, message, options);
}
export function warning(title, message, options) {
    return addMessage(MESSAGE_TYPES.WARNING, title, message, options);
}
export function error(title, message, options) {
    return addMessage(MESSAGE_TYPES.ERROR, title, message, options);
}

export function removeMessage(index) {
    return { type: MESSAGE_ACTION.REMOVE_MESSAGE, index: index }
}