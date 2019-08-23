import _notification, { HOCNotification } from './notification';
import {
    addMessage,
    error,
    info,
    success,
    warning,
    removeMessage,
    MESSAGE_TYPES,
    MESSAGE_ACTION,
} from './action_creator';

export const Notification = _notification;
export const NotificationHOC = HOCNotification;
export const NotifyActions = {
    addMessage,
    error,
    info,
    success,
    warning,
    removeMessage,
};
export const ENUM = {
    MESSAGE_TYPES,
    MESSAGE_ACTION,
};
export default {
    Notification,
    HOCNotification,
    NotifyActions,
    ENUM
}