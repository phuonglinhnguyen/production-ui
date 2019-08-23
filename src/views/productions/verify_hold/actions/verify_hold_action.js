import axios from 'axios';

import clone from 'clone';

import {
  checkUnComment,
  getNextTask,
  getTaskInResponse
} from './verify_hold_utility';

import { errorCall } from '../../../../components/common/ajax/call_ajax/actions/call_ajax_action';

import {
  VERIFY_HOLD_MODIFY_TASK,
  VERIFY_HOLD_RECEIVE_ERROR,
  VERIFY_HOLD_RECEIVE_TASKS,
  VERIFY_HOLD_REQUEST_TASKS,
  VERIFY_HOLD_RESET_STATE,
  VERIFY_HOLD_SAVE_FAILURE,
  VERIFY_HOLD_SAVE_SUCCESS,
  VERIFY_HOLD_SAVING_TASK,
  VERIFY_HOLD_SELECT_TASK,
  VERIFY_HOLD_UPDATE_NEXT_TASK
} from '../constants/verify_hold_constant';
import { BPMN_PROCESS_KEY } from '../../../../constants/previous';
import { APP_NAME, BPMN_ENDPOINT } from '../../../../constants';

const callAPIGetTask = (project_id, task_key_def, doc_size, username) => {
  return axios.patch(
    `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${task_key_def}/claim?maxResult=${doc_size}`,
    { user_name: username }
  );
};

const handleSuccess = response => (dispatch, getState) => {
  /*******************************************************
   *******************CONVERT DATA************************
   *******************************************************/
  try {
    let tasks = [];
    for (let key_doc in response) {
      if (response.hasOwnProperty(key_doc)) {
        let element = response[key_doc];
        tasks = [...tasks, getTaskInResponse(element)];
      }
    }
    /*******************************************************
     *******************SAVE TO REDUCER*********************
     *******************************************************/
    dispatch({
      type: VERIFY_HOLD_RECEIVE_TASKS,
      tasks: tasks,
      is_empty_state: false
    });
    return dispatch(selectTask(0, tasks));
  } catch (error) {
    return dispatch(handleFailure(error));
  }
};

const handleFailure = error => dispatch => {
  dispatch({
    type: VERIFY_HOLD_RECEIVE_ERROR
  });
  return dispatch(errorCall(error.message));
};

const getTask = (
  project_id,
  task_key_def,
  doc_size,
  username,
  history
) => async (dispatch, getState) => {
  dispatch({
    type: VERIFY_HOLD_REQUEST_TASKS
  });
  /*******************************************************
   *******************CALL API****************************
   *******************************************************/
  try {
    const res = await callAPIGetTask(
      project_id,
      task_key_def,
      doc_size,
      username
    );
    return dispatch(handleSuccess(res.data));
  } catch (error) {
    return dispatch(handleFailure(error));
  }
};

const selectTask = (task_index, task) => (dispatch, getState) => {
  const task_index_selected = getState().production.verify_hold
    .task_index_selected;
  if (task_index === task_index_selected) {
    return;
  }
  if (!task) {
    task = getState().production.verify_hold.tasks;
  }
  return dispatch({
    type: VERIFY_HOLD_SELECT_TASK,
    task_selected: task[task_index],
    task_index_selected: task_index
  });
};

const modifyComment = (index, comment) => (dispatch, getState) => {
  let task_selected = clone(getState().production.verify_hold.task_selected);
  let section_error = getState().production.verify_hold.section_error;
  if (section_error !== -1 && section_error === index && comment) {
    section_error = -1;
  }
  let hold_data = task_selected.hold_data;
  let section_data = clone(hold_data[index]);
  section_data.lead_comment = comment;
  hold_data[index] = section_data;
  task_selected.hold_data = hold_data;
  return dispatch({
    type: VERIFY_HOLD_MODIFY_TASK,
    task_selected: task_selected,
    section_error: section_error
  });
};

const modifyHold = sf => (dispatch, getState) => {
  let task_selected = clone(getState().production.verify_hold.task_selected);
  let section_error = getState().production.verify_hold.section_error;

  task_selected.hold = sf;
  return dispatch({
    type: VERIFY_HOLD_MODIFY_TASK,
    task_selected: task_selected,
    section_error: section_error
  });
};

const saveTask = (
  project_id,
  task_key_def,
  doc_size,
  username,
  history
) => async (dispatch, getState) => {
  const task_selected = clone(getState().production.verify_hold.task_selected);
  let tasks = clone(getState().production.verify_hold.tasks);
  const task_index_selected = clone(
    getState().production.verify_hold.task_index_selected
  );
  let layout_name =
    task_selected.hold && task_selected.is_wrong_line
      ? task_selected.is_wrong_line
      : '';
  const { next_task, is_saving } = getState().production.verify_hold;
  if (is_saving) {
    return;
  }
  const result = dispatch(
    checkUnComment(task_selected, username, task_key_def)
  );
  if (!result) {
    return;
  }
  dispatch({
    type: VERIFY_HOLD_SAVING_TASK
  });
  try {
    await axios.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_selected.task_id}/complete`, {
      ...result
    });
    if (layout_name) {
      await axios.patch(
        `/apps/${APP_NAME}/projects/${project_id}/documents?id=${
          task_selected.doc_id
        }&attributes=classify`,
        {
          layout_name: layout_name,
          classify: [
            {
              classifier: username,
              task_name: 'Verify hold',
              task_id: task_selected.task_id,
              task_def_key: task_key_def,
              layout_name: layout_name
            }
          ]
        }
      );
    }
    let { task_data, task_index, new_task_selected } = getNextTask(
      tasks,
      task_index_selected
    );
    if (task_data.length === 0) {
      if (next_task) {
        return dispatch(
          getTask(project_id, task_key_def, doc_size, username, history)
        );
      } else {
        return dispatch({
          type: VERIFY_HOLD_RESET_STATE
        });
      }
    }
    return dispatch({
      type: VERIFY_HOLD_SAVE_SUCCESS,
      tasks: task_data,
      task_index_selected: task_index,
      task_selected: new_task_selected
    });
  } catch (error) {
    dispatch(errorCall(error.message));
    return dispatch({
      type: VERIFY_HOLD_SAVE_FAILURE
    });
  }
};

const updateNextTask = () => ({
  type: VERIFY_HOLD_UPDATE_NEXT_TASK
});

const resetState = () => ({
  type: VERIFY_HOLD_RESET_STATE
});

export {
  getTask,
  modifyComment,
  modifyHold,
  saveTask,
  selectTask,
  updateNextTask,
  resetState
};
