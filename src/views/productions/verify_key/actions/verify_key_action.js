import axios from 'axios';

import {
  ROUTE_VERIFY_KEY,
  VERIFY_KEY_DONE_GET_FIELDS_DEFINITION,
  VERIFY_KEY_RECIEVE_TASK,
  VERIFY_KEY_REQUEST_TASK,
  VERIFY_KEY_RESET_STATE,
  VERIFY_KEY_RESET_STATE_FIELDS_DEFINITION,
  VERIFY_KEY_SAVED_SUCCESS_TASK,
  VERIFY_KEY_SAVING_TASK,
  VERIFY_KEY_UPDATE_NEXT_TASK
} from '../constants/verify_key_contants';

import { getFieldDefinitions } from './field_definitions_action';
import { onSelectRecord } from './verify_key_data_action';
import { setDocInfo } from '../../../LayoutHeaderInfo/actionCreator';
import {
  compareData,
  checkErrorExist,
  checkUnVerify,
  parseResponseToData
} from './verify_key_utilizing';
import {
  handleError as handleErrorSnackbar,
  openRespondSnackbar
} from '../../../shares/Snackbars/actionCreator';
import _ from 'lodash';

const handleError = (
  error: any,
  history: any,
  form_url: string,
  is_reset_state: boolean = false
) => (dispatch: any) => {
  history.push(form_url);

  dispatch({
    type: VERIFY_KEY_RECIEVE_TASK,
    data_document: [{}],
    error_document: [{}],
    data_final: [{}],
    doc_info: null,
    is_empty_state: true
  });
  if (is_reset_state) {
    dispatch({
      type: VERIFY_KEY_RESET_STATE
    });
  }
  if (_.has(error, 'response.status')) {
    error.response.status = -1;
    return dispatch(handleErrorSnackbar(error, '', true));
  } else {
    return dispatch(openRespondSnackbar(error, true, ''));
  }
};

const handleSuccess = (
  response: any,
  project_id: string,
  username: string,
  history: any,
  layout: string,
  section: string
) => async (dispatch: any, getState: any) => {
  const { variables, taskDefinitionKey, id: taskId } = response;
  const data = parseResponseToData(variables);
  const form_uri = variables[1].value;
  const redirect_url = `${ROUTE_VERIFY_KEY}/${project_id}/${layout}/${section}/${taskDefinitionKey}`;
  if (form_uri !== redirect_url) {
    return dispatch(
      handleError(
        `Task id invalid with url`,
        history,
        `/${form_uri}/${taskId}`,
        true
      )
    );
  }
  if (!data) {
    return dispatch(
      handleError(
        `Wrong workflow variables structure`,
        history,
        `/${ROUTE_VERIFY_KEY}/${project_id}/${layout}/${section}/${taskDefinitionKey}`
      )
    );
  }
  // const keyed_data = await _.pick(input_data, _.remove(Object.keys(input_data), _v => _v.includes("output_data")));
  const keyed_data = _.omit(data, 'doc');
  let arr_task = _.difference(Object.keys(keyed_data), ['diff_keyed_data']);
  const field_definitions = getState().production.verify_key.field_definitions
    .data;
  const data_1 = keyed_data[arr_task[0]].key_datas;
  const data_2 = keyed_data[arr_task[1]].key_datas;

  if (
    !Array.isArray(data_1[data_1.length - 1].records) ||
    !Array.isArray(data_2[data_2.length - 1].records)
  ) {
    return dispatch(
      handleError(
        `Wrong datas structure: ${taskId}`,
        history,
        `/${ROUTE_VERIFY_KEY}/${project_id}/${layout}/${section}/${taskDefinitionKey}`
      )
    );
  }
  history.push(`/${redirect_url}/${taskId}`);
  const data_doc_info = data.doc || {};
  const document = dispatch(
    compareData(
      data_1[data_1.length - 1].records,
      data_2[data_2.length - 1].records,
      field_definitions
    )
  );

  const doc_info = _.pick(data_doc_info, ['s2_url', 'id']);
  dispatch({
    ...document,
    type: VERIFY_KEY_RECIEVE_TASK,
    doc_info: { ...doc_info, task_id: taskId },
    show_error: false,
    is_empty_state: false,
    status_text: ''
  });
  dispatch(onSelectRecord(0));
  return dispatch(
    setDocInfo({
      batch_name: data_doc_info.batch_id,
      doc_name: data_doc_info.id,
      doc_uri: data_doc_info.s2_url
    })
  );
};

export const getRelateDefinition = (
  project_id: string,
  layout: string,
  section: string
) => async (dispatch: any) => {
  await dispatch(getFieldDefinitions(project_id, layout, section));

  return dispatch({
    type: VERIFY_KEY_DONE_GET_FIELDS_DEFINITION
  });
};

export const getTask = (
  project_id: string,
  task_def_key: string,
  task_id: string,
  username: string,
  history: any,
  layout: string,
  section: string
) => async (dispatch: any, getState: any) => {
  if (getState().production.verify_key.verify_key.is_fetching_task) {
    return;
  }
  dispatch({
    type: VERIFY_KEY_REQUEST_TASK
  });
  try {
    if (task_id) {
      const response = await axios.patch(`/workflow/tasks/${task_id}/claim`);
      return dispatch(
        handleSuccess(
          response.data,
          project_id,
          username,
          history,
          layout,
          section
        )
      );
    } else {
      const response = await axios.patch(
        `/workflow/tasks/start_${project_id}/${task_def_key}/claim`,
        {
          user_name: username
        }
      );
      return dispatch(
        handleSuccess(
          response.data,
          project_id,
          username,
          history,
          layout,
          section
        )
      );
    }
  } catch (error) {
    return dispatch(
      handleError(
        error,
        history,
        `/${ROUTE_VERIFY_KEY}/${project_id}/${layout}/${section}/${task_def_key}`
      )
    );
  }
};

export const saveTask = (
  username: string,
  project_id: string,
  layout: string,
  section: string,
  task_def_key: string,
  next_task: boolean,
  history: any
) => async (dispatch: any, getState: any) => {
  const {
    data_final,
    doc_info,
    error_document,
    is_saving
  } = getState().production.verify_key.verify_key;
  const { ip } = getState().user.user;
  if (is_saving) {
    return;
  }
  const result = dispatch(
    checkUnVerify(
      data_final,
      username,
      section,
      task_def_key,
      doc_info.task_id,
      ip
    )
  );
  if (!result) {
    return;
  }

  if (dispatch(checkErrorExist([...error_document]))) {
    return;
  }
  const { records_db, records_workflow } = result;
  dispatch({
    type: VERIFY_KEY_SAVING_TASK
  });
  try {
    await axios.patch(
      `/projects/${project_id}/documents?id=${
        doc_info.id
      }&attributes=keyed_data`,
      { records: records_db }
    );
    await axios.patch(`/workflow/tasks/${doc_info.task_id}/complete`, {
      [task_def_key + '_output_data']: {
        type:"verify_keying",
        comment: '',
        complete_reason: '',
        complete_reason_title: '',
        completed: true,
        hold_count: 0,
        key_datas: [{ records: records_workflow }],
        user: username
      }
    });
    dispatch(openRespondSnackbar('productions.verify_key.saved'));
    if (!next_task) {
      history.push(
        `/${ROUTE_VERIFY_KEY}/${project_id}/${layout}/${section}/${task_def_key}`
      );
      return dispatch({
        type: VERIFY_KEY_SAVED_SUCCESS_TASK
      });
    }

    dispatch({
      type: VERIFY_KEY_SAVED_SUCCESS_TASK
    });
    return dispatch(
      getTask(
        project_id,
        task_def_key,
        null,
        username,
        history,
        layout,
        section
      )
    );
  } catch (error) {
    if (_.has(error, 'response.status')) {
      error.response.status = -1;
      return dispatch(handleErrorSnackbar(error, '', true));
    } else {
      return dispatch(openRespondSnackbar(error, true, ''));
    }
  }
};

export const resetState = () => dispatch => {
  dispatch({
    type: VERIFY_KEY_RESET_STATE
  });
  return dispatch({
    type: VERIFY_KEY_RESET_STATE_FIELDS_DEFINITION
  });
};

export const updateNextTask = () => ({
  type: VERIFY_KEY_UPDATE_NEXT_TASK
});
