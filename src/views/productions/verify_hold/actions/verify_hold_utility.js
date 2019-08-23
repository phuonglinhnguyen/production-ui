import clone from 'clone';

import { omit } from 'lodash';

import {
  VERIFY_HOLD_KEY_WORKFLOW_COMPLETE_REASON,
  VERIFY_HOLD_KEY_WORKFLOW_HOLD_DATA,
  VERIFY_HOLD_KEY_WORKFLOW_INPUT_DATA,
  VERIFY_HOLD_KEY_WORKFLOW_KEY_DATAS,
  VERIFY_HOLD_KEY_WORKFLOW_VALUE,
  VERIFY_HOLD_VALIDATE_ERROR,
  VERIFY_HOLD_KEY_WORKFLOW_LAYOUT_NAME,
  VERIFY_HOLD_KEY_WORKFLOW_SECTION_NAME,
} from '../constants/verify_hold_constant';

const getKeyedData = data => {
  let result = [];
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let element = data[key];
      result = [...result, element.keyed_data];
    }
  }
  return result;
};

const getHoldData = (data_document = []) => {
  let response_hold = [];
  let is_wrong_line = '';
  for (let key in data_document) {
    if (data_document.hasOwnProperty(key)) {
      let element = data_document[key];
      if (!element) {
        continue;
      }
      let complete_reason = element[VERIFY_HOLD_KEY_WORKFLOW_COMPLETE_REASON];
      if (complete_reason && complete_reason !== 'resolved') {
        const arrs = key.split(' ');
        if (['WLN', 'Bad'].indexOf(complete_reason) !== -1) {
          is_wrong_line = complete_reason;
        }
        let data = {
          ...element,
          layout_name: element[VERIFY_HOLD_KEY_WORKFLOW_LAYOUT_NAME],
          section_name: element[VERIFY_HOLD_KEY_WORKFLOW_SECTION_NAME],
          task_definition: arrs.filter(arr => arr.includes("output_data"))[0]
        };
        const key_datas = element[VERIFY_HOLD_KEY_WORKFLOW_KEY_DATAS] || [];
        if (key_datas.length > 0) {
          if (Array.isArray(key_datas[0].records)) {
            data = {
              ...data,
              data_document: getKeyedData(key_datas[0].records)
            };
          } else {
            data = { ...data, data_document: getKeyedData(key_datas) };
          }
        }
        response_hold = [...response_hold, data];
      }
    }
  }
  return { hold_data: response_hold, is_wrong_line: is_wrong_line };
};

const getTaskInfo = data => {
  let doc_uri = data.doc_uri;
  let doc_id = data.id;
  return {
    batch_name: data.batch_name,
    doc_id: doc_id,
    doc_uri: doc_uri,
    s2_url: data.s2_url,
    image_name: data.id
  };
};

const getTaskInResponse = response => {
  const task_id = response.id;
  const variables = response.variables;
  let result = { task_id: task_id, hold: false };
  for (let key_word in variables) {
    if (variables.hasOwnProperty(key_word)) {
      let element = variables[key_word];
      if (element.name === VERIFY_HOLD_KEY_WORKFLOW_HOLD_DATA) {
        let { hold_data, is_wrong_line } = getHoldData(
          element[VERIFY_HOLD_KEY_WORKFLOW_VALUE]
        );
        result = {
          ...result,
          hold_data: hold_data,
          is_wrong_line: is_wrong_line
        };
      } else if (element.name === VERIFY_HOLD_KEY_WORKFLOW_INPUT_DATA) {
        const info = getTaskInfo(element[VERIFY_HOLD_KEY_WORKFLOW_VALUE]) || {};
        result = {
          ...result,
          ...info
        };
      }
    }
  }
  return result;
};

const checkUnComment = (task_selected, username, task_key_def) => dispatch => {
  const hold_data = task_selected[VERIFY_HOLD_KEY_WORKFLOW_HOLD_DATA];
  let result = {};
  result[`${task_key_def}_output_data`] = {
    value: {
      hold: `${task_selected.hold}`,
      type: 'verify_hold'
    }
  };
  for (let key in hold_data) {
    if (hold_data.hasOwnProperty(key)) {
      let data = clone(hold_data[key]);
      if (!data.lead_comment) {
        dispatch({
          type: VERIFY_HOLD_VALIDATE_ERROR,
          section_error: parseInt(key, 10)
        });
        return;
      }
      data.comment += '#EOL#' + username + ' : ' + data.lead_comment;
      data.complete_reason = 'resolved';
      const task_def_id = data.task_definition;
      result[task_def_id] = {
        value: omit(data, [
          'lead_comment',
          'data_document',
          'layout_name',
          'section_name',
          'task_definition'
        ])
      };
    }
  }
  return result;
};

const getNextTask = (task_data, task_index) => {
  task_data.splice(task_index, 1);
  if (task_index === task_data.length) {
    task_index = 0;
  }
  return { task_data, task_index, new_task_selected: task_data[task_index] };
};

export { getTaskInResponse, checkUnComment, getNextTask };
