import { ViewTypes } from '../types';
export const setNextTask = next => {
    return { type: ViewTypes.CHANGE_NEXT, next };
};

export const focusPosition = position => ({
    type: ViewTypes.FOCUS_POSITION,
    position: position
});


export default {
    setNextTask,
    focusPosition,
}
