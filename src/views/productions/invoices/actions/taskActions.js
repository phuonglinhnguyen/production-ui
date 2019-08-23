import { getDataForm, cleanDataForm } from '../../../../@components/FormInput';
import { getDataObject, crudGetOne, showNotification } from '@dgtx/coreui';
import { crudUpdate } from '@dgtx/coreui'
import { KEYING_TASK } from '../../../../providers/resources';
import { loadData, cleanFormState, showCommentSave, setFormStatePatching, setFormStateTryPatch, setFormStatePatchFailured, setLoadingForm } from './formActions';
import { setDataRecends } from '../../../../@components/FormInput/utils';
import ValidationPool from '../../../../@components/vaidationWorker'
import clone from 'clone'
const getDataRecord = ({ data, tranform, sections, info }) => {
    let result = [];
    sections.forEach(section => {
        result.push({
            ...info,
            section,
            source: null,
            data: data[section]
        })
        result.push({
            ...info,
            section,
            source: 'queue_transform',
            data: tranform[section]
        })
    })
    return result;
}

export const getDataWorkFlow = ({ tranforms, sections, info }) => {
    return tranforms.map((item, index) => {
        return sections.map(section => {
            return {
                ...info,
                section,
                data: item[section]
            }
        })
    })
}

export const getDataStore = ({ datas, tranforms, sections, info }) => {
    let result = {};

    datas.forEach((item, index) => {
        result[`records.${index}.keyed_data`] = getDataRecord({ data: item, tranform: tranforms[index], sections, info })
    })
    return result;
}

const getDataCompleteTask = ({ dataWorkFlow, sections, reason, state }) => {
    let { setting: { isNext } = {},
        task: {
            taskId,
            rework,
            hold_count,
            layoutName,
            projectId,
            taskKeyDef,
            assignee,
            input_data,
            comment,
            rework_fields,
            rework_comment,
            form_uri,
        }
    } = getDataObject('core.resources.form_state.data', state)
    let value = {
        type:"keying",
        form_uri:form_uri,
        documentId: input_data.docId,
        comment: comment,
        complete_reason: "",
        complete_reason_title: "",
        completed: "true",
        key_datas: dataWorkFlow,
        define_mask: undefined,
        user: assignee,
        hold_count: hold_count,
        layout_name: layoutName,
        section_name: sections,
    }
    if (reason) {
        let comment_text = comment ? comment + '#EOL#' : '';
        comment_text = comment_text + assignee + ':' + reason.comment_text || '';
        value = Object.assign({}, value, {
            "type":"hold",
            "comment": comment_text,
            "complete_reason": reason.value,
            "complete_reason_title": reason.label,
            "completed": "false",
            "hold_count": hold_count + 1,
        });
    }
    if (rework) {
        value['type'] = reason?"hold_rework":"rework";
        value['rework'] = false;
        value['rework_comment'] = rework_comment;
        value['rework_fields'] = rework_fields;
    }
    let data = {
        [`${taskKeyDef}_output_data`]: { value: value }
    }
    return { projectId, taskId, data, rework }
}
export const completeTask = ({ projectId, taskId, rework, docId, data }) => (dispatch, getState) => {
    let { setting: { isNext } = {}, task: { projectId, taskKeyDef, assignee } } = getDataObject('core.resources.form_state.data', getState())
    let { layoutName } = getDataObject('core.resources.form.data.layout', getState())
    ValidationPool.reset();
    dispatch(crudUpdate('keying_task',
        { projectId, taskId, data }, {
            onSuccess: ({ dispatch, result: { data } }) => {
                if (rework) {
                    dispatch(reworkedDoc(projectId, docId, taskKeyDef, 3));
                }
                dispatch(cleanDataForm())
                dispatch(cleanFormState())
                dispatch(showNotification('messages.success.save_task_success', 'success', { i18n: true, duration: 1500 }));
                if (isNext) {
                    dispatch(setLoadingForm())
                    dispatch(crudGetOne(KEYING_TASK, {
                        username: assignee,
                        projectId,
                        taskKeyDef,
                    },
                        {
                            onSuccess: ({ result: { data } }) => {
                                dispatch(showNotification('messages.success.claim_task_success', 'success', { i18n: true, duration: 2500 }))
                                dispatch(loadData({ projectId, layoutName, taskKeyDef, data }))
                            },
                            onFailure: () => {
                                dispatch(setLoadingForm(false))
                                dispatch(showNotification('messages.error.no_task', 'error', { i18n: true, duration: 2500 }))
                            }
                        }
                    ))
                }
            },
            onFailure: ({ dispatch, result }) => {
                dispatch(setFormStateTryPatch({ projectId, taskId, data }));
                dispatch(showNotification('messages.error.save_task_failure', 'error', { i18n: true, duration: 1500 }))
            }
        }
    ))
}

export const tryCompleleTask = (payload) => async (dispatch, getState) => {
    dispatch(setFormStatePatching())
    dispatch(completeTask(payload))

}

const reworkedDoc = (projectId, docId, taskKeyDef, num) => async (dispatch) => {
    dispatch(crudUpdate('rework_details', { projectId, docId, taskKeyDef }, {
        onSuccess: ({ dispatch, result: { data } }) => {
            // dispatch(completeTask(dataComplete))
        },
        onFailure: ({ dispatch, result: { data } }) => {
            num = num - 1;
            if (num > 0) {
                dispatch(reworkedDoc(projectId, docId, taskKeyDef, num))
            }
        }
    }))
}

export const pauseTask = () => async (dispatch, getState) => {
    let state = getState();
    let { patching, task: { taskId, projectId, taskKeyDef, assignee, input_data } } = getDataObject('core.resources.form_state.data', state)
    if (patching) {
        return;
    }
    let { values, value, current } = getDataObject('core.resources.form.data', state)
    values = clone(values);
    values[current] = value
    setDataRecends(taskId, values)
    dispatch(setFormStatePatching())
    dispatch(crudUpdate('document_pause', { projectId, taskId, username: assignee, data: { values } }, {
        onSuccess: () => {
            dispatch(cleanDataForm())
            dispatch(cleanFormState())
            dispatch(showNotification('messages.success.pause_task_success', 'success', { i18n: true, duration: 1500 }));
        },
        onFailure: ({ dispatch, result: { data } }) => {
            dispatch(setFormStatePatchFailured())
            dispatch(showNotification('messages.error.pause_task_failure', 'error', { i18n: true, duration: 1500 }))
        }
    }))
}

export const saveTask = (params) => async (dispatch, getState) => {
    let state = getState();
    let { setting: { isNext } = {},
        patching,
        task: { taskId, hold_count, projectId, taskKeyDef, assignee, input_data }
    } = getDataObject('core.resources.form_state.data', state)
    if (patching) { return; }
    let { dataUser, dataTransform, sections } = await dispatch(getDataForm({ isIgnoreWarning: false, isIgnoreError: !!params && params.option })) || {};
    if (!dataUser) {
        return;
    }
    const info = { keyer: assignee, ip: 'local', reason: params ? getDataObject('option.value', params) : null, task_id: taskId, task_def_key: taskKeyDef }
    let records = getDataStore({ datas: dataUser, tranforms: dataTransform, sections, info })
    let dataWorkFlow = getDataWorkFlow({ tranforms: dataTransform, sections, info })
    dispatch(setFormStatePatching())
    let dataComplete = getDataCompleteTask({
        dataWorkFlow, sections, reason: params ? params.option : null, state
    })

    dispatch(crudUpdate('documents', { projectId, taskId, documentId: input_data.docId, records }, {
        onSuccess: ({ dispatch, result: { data } }) => {
            dispatch(completeTask({ ...dataComplete, docId: input_data.docId }))
        },
        onFailure: ({ dispatch, result: { data } }) => {
            dispatch(setFormStatePatchFailured())
            dispatch(showNotification(data, 'error'))
        }
    }))
}

export const saveTaskWithReasonShortcut = (option) => () => async (dispatch, getState) => {
    const { comment } = option;
    if (comment) {
        dispatch(showCommentSave(option));
    } else {
        dispatch(saveTask({ option }))
    }

}

export const saveTaskWithReason = (option) => async (dispatch, getState) => {
    const { comment } = option;
    if (comment) {
        dispatch(showCommentSave(option));
    }

}
export const claimTask = ({
    username,
    projectId,
    taskKeyDef,
    layoutName,
}) => (dispatch, getState) => {
    dispatch(setLoadingForm())
    dispatch(crudGetOne(
        KEYING_TASK,
        {
            username,
            projectId,
            taskKeyDef
        }, {
            onSuccess: ({ result: { data } }) => {
                dispatch(showNotification('messages.success.claim_task_success', 'success', { i18n: true, duration: 2500 }))
                dispatch(loadData({ projectId, layoutName, taskKeyDef, data }))
            },
            onFailure: () => {
                dispatch(setLoadingForm(false))
                dispatch(showNotification('messages.error.no_task', 'error', { i18n: true, duration: 2500 }))
            }
        }
    ))
}
export const setStoreDataRecent = () => (dispatch, getState) => {
    let {
        values,
    } = getDataObject('core.resources.form.data', getState())
    let { task: { taskId } = {} } = getDataObject('core.resources.form_state.data', getState()) || { task: {} }
    if (taskId) {
        setDataRecends(taskId, values)
    }
}
