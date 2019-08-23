import clone from 'clone';
import {
    REWORK_BATCH_RESET_STATE_MULTIPLE_TASK,
    REWORK_BATCH_REQUEST_MULTIPLE_TASK,
    REWORK_BATCH_RESPONSE_MULTIPLE_TASK,
    REWORK_BATCH_MULTIPLE_SHOW_SNACKBAR,
    REWORK_BATCH_MULTIPLE_CLOSE_SNACKBAR,
    REWORK_BATCH_SAVING_MULTIPLE_TASK,
    REWORK_BATCH_SAVED_SUCCESS_MULTIPLE_TASK,
    REWORK_BATCH_SAVED_ERROR_MULTIPLE_TASK,
    REWORK_BATCH_MULTIPLE_SELECT_INDEX_BATCH,
    REWORK_BATCH_SHOW_DETAIL_BATCH,
    REWORK_BATCH_REQUEST_DETAIL,
    REWORK_BATCH_RESPONSE_DETAIL,
    REWORK_BATCH_SHOW_DIALOG,
    REWORK_BATCH_HIDDE_DIALOG,
    REWORK_BATCH_RESET
} from '../constants/action_types'

const initialState = {
    isFetchingTask: false,
    isSaving: false,
    dataTasks: null,
    selectedTasks: [],
    dataTasksLength: 0,
    isFetchingDetail: false,
    dataTask: null,
    statusText: '',
    showError: false,
    dialogType: '',
}

export default (state = clone(initialState), { type, payload, meta }) => {
    if (type === REWORK_BATCH_RESET_STATE_MULTIPLE_TASK) {
        return clone(initialState);
    } else if (type === REWORK_BATCH_REQUEST_MULTIPLE_TASK) {
        return {
            ...state,
            isFetchingTask: true
        }
    } else if (type === REWORK_BATCH_RESPONSE_MULTIPLE_TASK) {
        return {
            ...state,
            isFetchingTask: false,
            dataTasks: payload,
            dataTasksLength: meta.dataLength || 0,
            showError: meta.showError || false,
            statusText: meta.statusText || ''
        }
    } else if (type === REWORK_BATCH_MULTIPLE_SHOW_SNACKBAR) {
        return {
            ...state,
            showError: true,
            statusText: payload || ''
        }
    } else if (type === REWORK_BATCH_MULTIPLE_CLOSE_SNACKBAR) {
        return {
            ...state,
            showError: false,
            statusText: ''
        }
    } else if (type === REWORK_BATCH_SAVING_MULTIPLE_TASK) {
        return {
            ...state,
            isSaving: true
        }
    } else if (type === REWORK_BATCH_SAVED_ERROR_MULTIPLE_TASK) {
        return {
            ...state,
            isSaving: false,
            showError: true,
            statusText: payload || ''
        }
    } else if (type === REWORK_BATCH_MULTIPLE_SELECT_INDEX_BATCH) {
        return {
            ...state,
            selectedTasks: payload
        }
    } else if (type === REWORK_BATCH_SHOW_DETAIL_BATCH) {
        return {
            ...state,
            dataTask: payload
        }

    } else if (type === REWORK_BATCH_REQUEST_DETAIL) {
        return {
            ...state,
            isFetchingDetail: true
        }

    } else if (type === REWORK_BATCH_RESPONSE_DETAIL) {
        return {
            ...state,
            dataTask: payload,
            isFetchingDetail: false,
            showError: meta.showError || false,
            statusText: meta.statusText || ''
        }

    } else if (type === REWORK_BATCH_SAVED_SUCCESS_MULTIPLE_TASK) {
        let { success, faileds } = payload;
        return {
            ...state,
            isSaving: false,
            dataTasks: state.dataTasks.filter(item => !success.includes(item.taskId)),
            selectedTasks: state.selectedTasks.filter(item => !success.includes(item.taskId)),
            dataTasksLength: state.dataTasksLength - payload.length,
            showError: meta.showError || true,
            statusText: meta.statusText || `Succcess: ${success.length}${faileds.length ? ` ;Failed: ${faileds.length}` : ''}`
        }
    } else if (type === REWORK_BATCH_SAVED_ERROR_MULTIPLE_TASK) {
        return {
            ...state,
            isSaving: false,
            showError: true,
            statusText: payload,
        }
    } else if (type === REWORK_BATCH_SHOW_DIALOG) {
        return {
            ...state,
            dialogType: payload
        }
    } else if (type === REWORK_BATCH_HIDDE_DIALOG) {
        return {
            ...state,
            dialogType: ''
        }
    } else if (type === REWORK_BATCH_RESET) {
        return clone(initialState)
    }
    return state;
}
