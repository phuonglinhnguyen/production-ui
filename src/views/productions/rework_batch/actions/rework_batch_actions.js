import axios from 'axios';
import clone from "clone";
import {
    REWORK_BATCH_REQUEST_MULTIPLE_TASK,
    REWORK_BATCH_RESPONSE_MULTIPLE_TASK,
    REWORK_BATCH_SAVING_MULTIPLE_TASK,
    REWORK_BATCH_SAVED_SUCCESS_MULTIPLE_TASK,
    REWORK_BATCH_SAVED_ERROR_MULTIPLE_TASK,
    REWORK_BATCH_RESET_STATE_MULTIPLE_TASK,
    REWORK_BATCH_MULTIPLE_CLOSE_SNACKBAR,
    REWORK_BATCH_MULTIPLE_SHOW_SNACKBAR,
    REWORK_BATCH_MULTIPLE_SELECT_INDEX_BATCH,
    REWORK_BATCH_SHOW_DETAIL_BATCH,
    REWORK_BATCH_REQUEST_DETAIL,
    REWORK_BATCH_RESPONSE_DETAIL,
    REWORK_BATCH_SHOW_DIALOG,
    REWORK_BATCH_HIDDE_DIALOG,
    REWORK_BATCH_RESET
} from '../constants/action_types'
import { getList as getListFields } from '../../../../resources/creators/fields'
import { APP_NAME, BPMN_PROCESS_KEY, BPMN_ENDPOINT } from '../../../../constants';
import { fetchSections } from './sections_action';

export const closeSnackBar = () => ({
    type: REWORK_BATCH_MULTIPLE_CLOSE_SNACKBAR
})
export const showSnackBar = (text) => ({
    type: REWORK_BATCH_MULTIPLE_SHOW_SNACKBAR,
    payload: text
})
export const selectTasks = (taskIndexs, tasks) => ({
    type: REWORK_BATCH_MULTIPLE_SELECT_INDEX_BATCH,
    payload: tasks
})

const transformTasks = (res) => {
    try {
        if (Array.isArray(res.data)) {
            return res.data.map(item => {
                let batch_name = item.variables.filter(variable => variable.name === 'batch_name')[0].value;
                let batch_id = item.variables.filter(variable => variable.name === 'batch_id')[0].value;

                return {
                    batchId: batch_id,
                    taskId: item.id,
                    taskDefinitionKey: item.taskDefinitionKey,
                    batchName: batch_name,
                    totalDoc: 0
                }
            })
        } else {
            let batch_name = res.data.variables.filter(variable => variable.name === 'batch_name')[0].value;
            let batch_id = res.data.variables.filter(variable => variable.name === 'batch_id')[0].value;
            return [{
                batchId: batch_id,
                taskId: res.data.id,
                taskDefinitionKey: res.data.taskDefinitionKey,
                batchName: batch_name,
                totalDoc: 0
            }]
        }
    } catch (error) {
        return []
    }
}

const getInfoBatchs = async (projectId, batchs) => {
    let response = await axios.post(`/apps/${APP_NAME}/projects/${projectId}/rework-batches/info`, { project_id: projectId, batch_ids: batchs.map(item => item.batchId) })
    let map = {}
    response.data.forEach(element => {
        map[element.batch_id] = element;
    });
    return batchs.map(item => {
        let info = map[item.batchId];
        return {
            ...item,
            totalDoc: info.total_doc,
            totalDocRework: info.total_doc_rework,
            status: Number(info.status),
        }
    })
}

export const showBatchDetail = (projectId, batch) => async (dispatch, getState) => {
    try {
        dispatch({ type: REWORK_BATCH_SHOW_DETAIL_BATCH, payload: batch })
        if (batch) {
            dispatch({ type: REWORK_BATCH_REQUEST_DETAIL })
            let response = await axios.get(`/apps/${APP_NAME}/projects/${projectId}/rework-batches/${batch.batchId}`);
            batch.docs = response.data
            dispatch({ type: REWORK_BATCH_RESPONSE_DETAIL, payload: batch, meta: {} })
        }
    } catch (error) {
        dispatch({ type: REWORK_BATCH_RESPONSE_DETAIL, payload: batch, meta: { showError: true, statusText: error.message } })
    }
}


export const getTask = ({
    projectId,
    username,
    taskKeyDef
}) => async (dispatch, getState) => {
    if (getState().production.reworkBatch.isFetchingTask) {
        return;
    }
    try {
        dispatch(fetchSections(projectId))
        dispatch(getListFields(projectId))
    } catch (error) {

    }
    try {
        dispatch({ type: REWORK_BATCH_REQUEST_MULTIPLE_TASK })
        let response = await axios.get(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${taskKeyDef}?maxResult=0`)
        // ${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}
        let dataTasks = await transformTasks(response);
        let result = await getInfoBatchs(projectId, dataTasks);
        dispatch({
            type: REWORK_BATCH_RESPONSE_MULTIPLE_TASK,
            payload: result,
            meta: {
                dataLength: result.length
            }
        })
    } catch (error) {
        dispatch({
            type: REWORK_BATCH_RESPONSE_MULTIPLE_TASK,
            payload: [],
            meta: {
                showError: true,
                statusText: error.message
            }
        })
    }
}
export const saveTask = ({ sections, projectId, taskKeyDef, type, username, fields }) => async (dispatch, getState) => {
    const { isSaving, dataTasks, selectedTasks } = getState().production.reworkBatch;
    let tasks = selectedTasks.map(item => item.taskId)
    if (isSaving) {
        return;
    }
    dispatch({ type: REWORK_BATCH_SAVING_MULTIPLE_TASK })
    try {
        let response;
        if (type && type === 'rework') {
            response = await axios.post(`/apps/${APP_NAME}/projects/${projectId}/rework-batches/rework`, { username: username, task_ids: tasks, fields, sections })
        } else {
            response = await axios.post(`/apps/${APP_NAME}/projects/${projectId}/rework-batches/close`, { username: username, task_ids: tasks, fields, sections })
        }
        let { task_id, task_ids } = response.data;
        let success = task_ids ? task_ids : task_id ? [task_id] : [];

        let faileds = tasks.filter(item => !success.includes(item))

        dispatch({ type: REWORK_BATCH_SAVED_SUCCESS_MULTIPLE_TASK, payload: { success, faileds }, meta: { projectId, taskKeyDef, type, username } })
        dispatch(hideDialog())
    } catch (error) {
        dispatch({ type: REWORK_BATCH_SAVED_ERROR_MULTIPLE_TASK, payload: error.message })
        dispatch(hideDialog())
    }
}

export const showDialog = (type) => ({
    type: REWORK_BATCH_SHOW_DIALOG,
    payload: type
})
export const hideDialog = () => ({
    type: REWORK_BATCH_HIDDE_DIALOG,
})

export const resetReworBatch = () => ({
    type: REWORK_BATCH_RESET,
})

