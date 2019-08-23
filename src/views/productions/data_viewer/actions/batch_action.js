import axios from 'axios';

import { getDocInfoFromTaskData } from '../../invoice/actions/invoice_utility';
import { getTasks } from './task_action';

import { findIndex } from 'lodash';

import {
  DATA_VIEWER_RECIEVE_BATCHES,
  DATA_VIEWER_SELECT_BATCH,
  DATA_VIEWER_SELECT_STEP,
  DATA_VIEWER_RESET_BATCHES,
  DATA_VIEWER_RESET_TASKS,
  DATA_VIEWER_RESET_LAYOUTS,
  DATA_VIEWER_RECIEVE_BATCHES_ERROR,
  DATA_VIEWER_REQUEST_BATCHES
} from '../constants/data_viewer_constant';
import { errorCall } from '../../../../components/common/ajax/call_ajax/actions/call_ajax_action';
import { BPMN_PROCESS_KEY, APP_NAME, BPMN_ENDPOINT } from '../../../../constants';

const callAPIGetAllTasks = (project_id, task_key_def) => {
  return axios.get(
    `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${task_key_def}?maxResult=0`
  );
};

const groupByBatchId = datas => {
  let batches = [];
  for (const key in datas) {
    const element = datas[key];
    let { docInfo } = getDocInfoFromTaskData(element.variables);
    if (!docInfo) {
      continue;
    }
    const batch_index = findIndex(
      batches,
      _b => _b.batch_id === docInfo.batch_id
    );
    if (batch_index === -1) {
      batches = [
        ...batches,
        { count: 1, batch_name: docInfo.batch_name, batch_id: docInfo.batch_id }
      ];
    } else {
      let batch_item = batches[batch_index];
      batches[batch_index] = { ...batch_item, count: batch_item.count + 1 };
    }
  }
  return batches;
};

const checkCalling = getState => {
  return getState.production.data_viewer.batches.is_calling;
};

const getAllTaskAvailable = (params, username) => async (
  dispatch,
  getState
) => {
  if (checkCalling(getState())) {
    return;
  }
  try {
    dispatch({
      type: DATA_VIEWER_REQUEST_BATCHES
    });
    const response = await callAPIGetAllTasks(
      params.projectId,
      params.taskKeyDef
    );
    const batches = groupByBatchId(response.data);
    return dispatch({
      type: DATA_VIEWER_RECIEVE_BATCHES,
      datas: batches
    });
  } catch (error) {
    dispatch(errorCall(error.toString()));
    return dispatch({
      type: DATA_VIEWER_RECIEVE_BATCHES_ERROR
    });
  }
};

const selectBatch = (batch, params, username) => dispatch => {
  dispatch({
    type: DATA_VIEWER_SELECT_BATCH,
    batch_selected: batch
  });

  return dispatch(getTasks(params, username, batch));
};

const selectStep = (step, params, username) => dispatch => {
  if (step === 0) {
    dispatch(getAllTaskAvailable(params, username));
  }
  return dispatch({
    type: DATA_VIEWER_SELECT_STEP,
    step: step
  });
};

const resetState = () => dispatch => {
  dispatch({
    type: DATA_VIEWER_RESET_TASKS
  });
  dispatch({
    type: DATA_VIEWER_RESET_LAYOUTS
  });
  return dispatch({
    type: DATA_VIEWER_RESET_BATCHES
  });
};

export { getAllTaskAvailable, selectBatch, selectStep, resetState };
