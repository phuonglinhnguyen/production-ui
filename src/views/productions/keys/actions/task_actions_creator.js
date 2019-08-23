import { TaskTypes } from '../types';
import XClient from '../../../../resources/api';
import { NotifyActions } from '../../../shares/notification';
import {
  getDatasKeying,
  getDatasKeyingTraining,
  getRecordBySectionLastest,
  getCompleteReason,
  getDataStore
} from './ulti';
import {
  TIME_TRY_RELOAD,
  MAX_TRY_RELOAD,
  TIME_TRY_LOAD,
  URL_MODULE,
  TASK_ID,
  TASK_DEF_KEY,
  KEY_QUEUE_TRANSFORM
} from '../constants';
import { BPMN_PROCESS_KEY } from '../../../../constants';
const fetching = () => ({ type: TaskTypes.FETCHING });
const didInValidate = () => ({ type: TaskTypes.DID_INVALIDATION });
const fetchReceive = (data, access, canClaim) => ({
  type: TaskTypes.RECEIVE,
  payload: { data, access, canClaim }
});
const claimDidInvalidate = data => ({
  type: TaskTypes.CLAIM_DID_INVALIDATION,
  payload: data
});
const claimReceive = data => ({ type: TaskTypes.CLAIM_RECEIVE, data });
const completingTask = () => ({ type: TaskTypes.PATCHING });
const completeTaskFailed = (info) => ({ type: TaskTypes.PATCH_FAILED, info });
const saveDocSuccess = (dataKeying, dataTranform) => ({
  type: TaskTypes.SAVE_DOC_SUCESS,
  dataKeying,
  dataTranform,
});
const saveDocFailed = () => ({ type: TaskTypes.SAVE_DOC_FAILED });

export const referData = (task, layout) => dispatch => {
  let referData;
  try {
    if (!task.referData) {
      if (task.item && layout.item.refer) {
        referData = {};
        let refer = layout.item.refer;
        let referSource = task.item.doc.records[0][refer.source];
        referSource = referSource[referSource.length - 1];
        refer.fields.forEach(field => {
          if (referSource[field]) referData[field] = referSource[field];
        });
      }
    }
  } catch (error) { }
  if (referData) {
    dispatch({ type: TaskTypes.REFER_DATA, referData });
  }
};

const isIntask = (info, task) => info.taskId === task.taskDefinitionKey;
const canClaim = (info, task) => isIntask(info, task) && !task.endTime;
const isAccess = (info, task) =>
  canClaim(info, task) && task.assignee === info.userName;

const getReworkConfig = (task) => {
  try {
    let result = {};
    if (task.variables && task.variables.length) {
      let rework = task.variables.filter(
        variable => 'rework' === variable.name
      ).pop();
      let rework_comment = task.variables.filter(
        variable => 'rework_comment' === variable.name
      ).pop();
      let rework_fields = task.variables.filter(
        variable => 'rework_fields' === variable.name
      ).pop();
      if (rework && rework.value) {
        result['rework'] = rework.value
        result['rework_comment'] = rework_comment.value
        result['rework_fields'] = rework_fields.value
        return result;
      }
    }
    return;
  } catch (error) {
    return;
  }
}

const getDataOfTask = async (task, info, isGetTask) => {
  if (info.isTraining) {
    return getDataOfTaskTraining(task, info);
  }
  try {
    let completeOptions = [];
    let complete_option = task.variables.filter(
      variable => 'complete_option' === variable.name
    )[0];
    if (complete_option && complete_option.value) {
      completeOptions = getCompleteReason(complete_option.value);
    }
    let comment = task.variables.filter(
      variable => 'comment' === variable.name
    )[0];
    let hold_count = task.variables.filter(
      variable => 'hold_count' === variable.name
    )[0];
    let key_data = task.variables.filter(
      variable => 'key_data' === variable.name
    )[0];
    let input_data = task.variables.filter(
      variable => 'input_data' === variable.name
    )[0];
    let define_mask = task.variables.filter(
      variable => 'define_mask' === variable.name
    )[0];
    let lastRecord = [];
    let mask = {};
    let dataAutoSave = await XClient.recent_data.get_resent_data(info.userName)
    if (!dataAutoSave.error) {
      if (task.id === dataAutoSave.payload.task_id) {
        lastRecord = dataAutoSave.payload.data || [];
      }
    }
    if (lastRecord.length === 0) {
      if (key_data.value) {
        let _dataValue = key_data.value.pop();
        if (_dataValue) {
          lastRecord = getRecordBySectionLastest(
            _dataValue.records,
            info.sectionName,
            info.userName
          );
        }
      }
    }
    if (define_mask) {
      mask = define_mask.value;
    }
    let rework = getReworkConfig(task);
    let _holdCount = (hold_count && hold_count.value)
      ? parseInt(hold_count.value, 10) : 0;
    return {
      records: lastRecord,
      doc: input_data.value,
      task: {
        ...task,
        mask,
        rework,
        comment_text: comment ? comment.value : '',
        is_hold: !!comment && comment.value,
        hold_count: _holdCount
      },
      complete_option: completeOptions
    };
  } catch (e) {
    return { records: [] };
  }
};
const getDataOfTaskTraining = async (task, info) => {
  try {
    let lastRecord = [];
    let dataAutoSave = await XClient.recent_data.get_resent_data(info.userName)
    if (!dataAutoSave.error) {
      if (task.doc[0]._id === dataAutoSave
        .payload
        .task_id) {
        lastRecord = dataAutoSave.payload.data || [];
      }
    }
    return {
      records: lastRecord,
      doc: { ...task.doc[0], id: task.doc[0]._id },
      task: {
        ...task,
        isTraining: true,
        id: task.training_data_id,
        assignee: info.userName,
        mask: {},
        comment_text: '',
        is_hold: false,
        hold_count: 0
      },
      complete_option: []
    };
  } catch (e) {
    return { records: [{}] };
  }
};
export const claimNextTask = (info, task) => async (dispatch, getState) => {
  try {
    if (!task.isFetching) {
      dispatch(fetching());
      let _res;
      if (info.isTraining) {
        _res = await XClient['task_training'].claim_next(info.projectId, info.taskId, info.userName);
      } else {
        _res = await XClient['task'].claim_next(info.projectId, BPMN_PROCESS_KEY, info.taskId, info.userName);
      }
      if (_res.error) {
        dispatch(NotifyActions.info('', 'productions.keying.message.info.no_task', { i18: !0 }));
        dispatch(claimDidInvalidate(_res.payload));
        // let redirectUrl = `${info.isTraining ? "/training/" : ""}${URL_MODULE}/${info.projectId}/${info.layoutName}/${info.sectionName}/${info.taskId}`;
        // console.log('====================================');
        // console.log(redirectUrl);
        // console.log('====================================');
        // info.history.push(redirectUrl);
      } else {
        let _task = _res.payload;
        let _datas = await getDataOfTask(_task, info);
        dispatch(claimReceive(_datas));
        let redirectUrl = `${info.isTraining ? "/training" : ""}/${URL_MODULE}/${info.projectId}/${info.layoutName}/${info.sectionName}/${info.taskId}/${_datas.task.id}`;
        info.history.push(redirectUrl);
      }
    }
  } catch (e) {
    dispatch(NotifyActions.info('', 'productions.keying.message.info.no_task', { i18: !0 }));
    dispatch(claimDidInvalidate({}));
  }
};

export const claimTask = (info, task) => async (dispatch, getState) => {
  try {
    if (!task.isFetching) {
      dispatch(fetching());
      let _res;
      if (info.isTraining) {
        _res = await XClient['task_training'].claim_next(info.projectId, info.taskId, info.userName);
      } else {
        _res = await XClient['task'].claim(info.projectId,info.taskInstanceId, info.userName);
      }
      if (!_res || _res.error) {
        dispatch(claimDidInvalidate(_res.payload));
        dispatch(NotifyActions.error('', 'productions.keying.message.error.cant_claim_task', { i18: !0 }));
      } else {
        let _datas = await getDataOfTask(_res.payload, info);
        dispatch(claimReceive(_datas));
      }
    }
  } catch (error) { }
};
const fetchTask = (info, didInvali) => async dispatch => {
  let _res;
  if (info.isTraining) {
    _res = await XClient['task_training'].claim_next(info.projectId, info.taskId, info.userName);
  } else {
    _res = await XClient['task'].get(info.projectId, info.taskInstanceId);
  }
  if (!_res || _res.error) {
    dispatch(didInValidate(_res.payload));
    didInvali === MAX_TRY_RELOAD - 1 &&
      dispatch(
        NotifyActions.error('', 'productions.keying.message.error.cant_get_task', { i18: !0 }));
  } else {
    let _task = _res.payload;
    let _datas = await getDataOfTask(_task, info, true);
    if (info.isTraining) {
      dispatch(claimReceive(_datas));
    } else {
      dispatch(fetchReceive(_datas, isAccess(info, _datas.task), canClaim(info, _datas.task)));
    }
  }
};

const shouldFetch = (info, task) => {
  return (
    (!task.item || task.item.task.id !== info.taskInstanceId) &&
    !task.isFetching && task.didInvalidate < MAX_TRY_RELOAD
  );
};
const fetchIfNeeded = (info, task) => async (dispatch, getState) => {
  let isShouldFetch = shouldFetch(info, task);
  if (isShouldFetch) {
    dispatch(fetching());
    let _fetchTask = fetchTask(info, task.didInvalidate);
    if (task.didInvalidate > 0) {
      setTimeout(() => {
        dispatch(_fetchTask);
      }, TIME_TRY_RELOAD[task.didInvalidate] || TIME_TRY_LOAD);
    } else {
      dispatch(_fetchTask);
    }
  }
};

const getDataOfRecords = data => {
  data.records.forEach(item => {
    delete item.keyed_data.keyer;
    delete item.keyed_data.section;
    delete item.keyed_data.source;
    delete item.keyed_data.ip;
    delete item.keyed_data.reason;
    delete item.keyed_data[TASK_ID];
    delete item.keyed_data[TASK_DEF_KEY];
  })
  return data
}
const reworkedDoc = async (info, task, num) => {
  let _res = await XClient['document'].reworked_doc(info.projectId, task.item.doc.id, info.taskId);
  if (_res.error) {
    num = num - 1;
    if (num > 0) {
      reworkedDoc(info, task, num)
    }
  }
}
const completeTask = (info, task, isNext, dataKeying, reason, is_define_mask) => async (dispatch) => {
  let inputBody = {};
  let value = {
    "comment": task.item.task.comment_text || '',
    "complete_reason": "",
    "complete_reason_title": "",
    "completed": "true",
    "key_datas": [getDataOfRecords(dataKeying)],
    "define_mask": is_define_mask ? { ...task.mask, record_input: task.records.map(record => { return !Object.keys(record).every(key => { return record[key].trim().length === 0 }); }) } : undefined,
    "user": info.userName,
    "hold_count": task.item.task.hold_count,
    "layout_name": info.layoutName,
    "section_name": info.sectionName,
  }
  if (reason) {
    let comment_text = task.item.task.comment_text && task.item.task.comment_text.length ? task.item.task.comment_text + '#EOL#' : '';
    comment_text = comment_text + info.userName + ':' + reason.comment_text || ''
    value = Object.assign({}, value, {
      "comment": comment_text,
      "complete_reason": reason.value,
      "complete_reason_title": reason.label,
      "completed": "false",
      "hold_count": task.item.task.hold_count + 1,
      
    });
  }
  if (task.item && task.item.task  && task.item.task.rework) {
    value['rework'] = !!reason;
    value['rework_comment'] = task.item.task.rework.rework_comment;
    value['rework_fields'] = task.item.task.rework.rework_fields;
  }
  inputBody[`${task.item.task.taskDefinitionKey}_output_data`] = { value: value };
  let _res;
  if (info.isTraining) {
    _res = await XClient['task_training'].complete(task.item.task.id, task.item.doc.id, inputBody);
  } else {
    _res = await XClient['task'].complete(info.projectId, task.item.task.id, inputBody);
  }
  if (_res.error) {
    dispatch(
      NotifyActions.error(
        '',
        'productions.keying.message.error.complete_task_failed',
        { i18: !0 }
      )
    );
    if (info.isTraining) {
      dispatch(completeTaskFailed({ taskId: task.item.task.id, doc_id: task.item.doc.id, isNext, info, inputBody }));
    } else {
      dispatch(completeTaskFailed({ taskId: task.item.task.id, isNext, info, inputBody }));
    }
  } else {
    dispatch(
      NotifyActions.success(
        '',
        'productions.keying.message.success.save_success',
        { i18: !0 }
      )
    );
    if (!reason&&(task.item && task.item.task && task.item.task.rework)) {
      reworkedDoc(info, task, 3);
    }
    dispatch(resetTask())
    if (isNext) {
      dispatch(claimNextTask(info, task));
    } else {
      info.history.push(
        `${info.isTraining ? "/training" : ""}/${URL_MODULE}/${info.projectId}/${info.layoutName}/${
        info.sectionName
        }/${info.taskId}`
      );
    }
  }
};
export const retryCompleteTask = () =>
  async (dispatch, getState) => {
    let task = getState().keyings.task
    let task_complete_data = task.task_complete_data;
    let info = task_complete_data.info;
    try {
      dispatch(completingTask());
      let _res;
      if (info.isTraining) {
        _res = await XClient['task_training'].complete(task_complete_data.taskId, task_complete_data.doc_id, task_complete_data.inputBody);
      } else {
        _res = await XClient['task'].complete(info.projectId, task_complete_data.taskId, task_complete_data.inputBody);
      }
      if (_res.error) {
        dispatch(
          NotifyActions.error(
            '',
            'productions.keying.message.error.complete_task_failed',
            { i18: !0 }
          )
        );
        dispatch(completeTaskFailed(task_complete_data));
      } else {
        dispatch(
          NotifyActions.success(
            '',
            'productions.keying.message.success.save_success',
            { i18: !0 }
          )
        );
        dispatch(resetTask())
        if (task_complete_data.isNext) {
          dispatch(claimNextTask(task_complete_data.info, task));
        } else {
          info.history.push(
            `${info.isTraining ? "/training" : ""}/${URL_MODULE}/${info.projectId}/${info.layoutName}/${
            info.sectionName
            }/${info.taskId}`
          );
        }
      }
    } catch (error) {
      dispatch(
        NotifyActions.error(
          '',
          'productions.keying.message.error.complete_task_failed',
          { i18: !0 }
        )
      );
      dispatch(completeTaskFailed(task_complete_data));
    }
  }
/**
 * 
 * @param {{projectId:String,isTraining:Boolean,sectionName:String,userName:String}} info 
 * @param {Object} task 
 * @param {Boolean} isNext 
 * @param {Object} layout 
 * @param {*} reason 
 * @param {*} getValueTranforms 
 */
export const saveDocument = (
  info,
  task,
  isNext,
  layout,
  reason,
  getValueTranforms
) => async (dispatch, getState) => {
  let location = '';
  let is_define_mask = false;
  try {
    location = getState().current_user.user.ip || ''
    is_define_mask = layout
      .item
      .section
      .settings
      .multiple
      .mask === 'define_mask'
  } catch (error) {
  }
  try {
    if (!task.isPatching) {
      dispatch(completingTask());
      let _res;
      let dataTranform, dataKeying;
      let dataTranformInput = getValueTranforms();
      if (info.isTraining) {
        if (dataTranformInput) {
          dataTranform = getDatasKeyingTraining(
            dataTranformInput,
            info.sectionName,
            layout.item.fields,
            info.userName,
            task.item.task,
            KEY_QUEUE_TRANSFORM,
            location,
            reason);
        }
        dataKeying = getDatasKeyingTraining(
          task.records,
          info.sectionName,
          layout.item.fields,
          info.userName,
          task.item.task,
          null,
          location, reason);
        _res = await XClient['document_training']
          .add_records_keyed_data(
            task.item.task.id,
            task.item.doc.id,
            [dataKeying, dataTranform]
          );
      } else {
        if (dataTranformInput) {
          dataTranform = getDatasKeying(
            dataTranformInput,
            info.sectionName,
            layout.item.fields,
            info.userName,
            task.item.task,
            KEY_QUEUE_TRANSFORM,
            location,
            reason);
        }
        dataKeying = getDatasKeying(
          task.records,
          info.sectionName,
          layout.item.fields,
          info.userName,
          task.item.task,
          null,
          location,
          reason);
        let dataStore = getDataStore({
          tranform: dataTranform.records,
          datas: dataKeying.records
        })

        _res = await XClient['document']
          .add_records_keyed_data(
            info.projectId,
            task.item.doc.id,
            dataStore
          );
      }
      if (_res.error) {
        /**@description if exist error while store data 
         * then notify a message for user know that */
        dispatch(NotifyActions.error('',
          'productions.keying.message.error.save_document_failed',
          { i18: !0 }));
        /**@description update stores for function excute failed */
        dispatch(saveDocFailed());
      } else {
        dispatch(saveDocSuccess(_res.payload, dataTranform));
        dispatch(completeTask(
          info,
          task,
          isNext,
          dataTranform,
          reason,
          is_define_mask));
      }
    }
  } catch (error) {

    dispatch(
      NotifyActions.error('',
        'productions.keying.message.error.save_document_failed',
        { i18: !0 }));

    dispatch(saveDocFailed());
  }
};
export const changeField = (fieldName, value) => ({
  type: TaskTypes.CHANGE_FIELD,
  fieldName,
  value
});
export const resetTask = () => ({ type: TaskTypes.RESET });
export const initRecords = num => ({ type: TaskTypes.INIT_RECORD, num });
export const selectRecord = index => ({ type: TaskTypes.SELECT_RECORD, index });
export const setDataRecord = (indexRecord) => (dispatch, getState) => {
  dispatch({
    type: TaskTypes.UPDATE_RECORD,
    indexRecord
  })
  let task = getState().keyings.task;
  if (task.item.task.isTraining) {
    XClient.recent_data.set_resent_data(task.item.task.assignee, task.item.doc.id, task.recordsCheckedData)
  } else {
    XClient.recent_data.set_resent_data(task.item.task.assignee, task.item.task.id, task.recordsCheckedData)
  }
};

export const setNextRecordWaiting = (indexNext) => ({ type: TaskTypes.NEXT_RECORD_WAITING, indexNext })

export const switchRecord = (index, isUp) => ({ type: TaskTypes.SWITCHING_RECORD, index, isUp })
export const insertRecord = (index) => ({ type: TaskTypes.INSERT_RECORD, index });
export const removeRecord = (index) => ({ type: TaskTypes.REMOVE_RECORD, index });
export const insertingRecord = (index) => ({ type: TaskTypes.INSERTING_RECORD, index });
export const removingRecord = (index) => ({ type: TaskTypes.REMOVING_RECORD, index });
export const onChangeMask = (name, value) => ({ type: TaskTypes.CHANGE_MASK, name, value });

export default {
  onChangeMask,
  insertRecord,
  removeRecord,
  insertingRecord,
  removingRecord,
  switchRecord,
  retryCompleteTask,
  setNextRecordWaiting,
  setDataRecord,
  resetTask,
  claimNextTask,
  claimTask,
  fetchIfNeeded,
  changeField,
  saveDocument,
  referData,
  initRecords,
  selectRecord
};
