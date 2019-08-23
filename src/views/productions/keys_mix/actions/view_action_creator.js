import { ViewTypes } from '../types';
export const setNextTask = next => {
    return { type: ViewTypes.CHANGE_NEXT, next };
};

export const focusPosition = position => ({
    type: ViewTypes.FOCUS_POSITION,
    position: position
});
export const setViewRecords = view => ({
    type: ViewTypes.SET_VIEW_RECORDS,
    view: view
});


export default {
    setNextTask,
    focusPosition,
    setViewRecords,
}
