import axios from "axios";
import {
  CLASSIFY_SINGLE_GET_DONE_DATA_DEFINITION,
  CLASSIFY_REQUEST_SINGLE_TASK,
  CLASSIFY_RESPONSE_SINGLE_TASK,
  CLASSIFY_SINGLE_SHOW_SNACKBAR,
  CLASSIFY_SINGLE_CLOSE_SNACKBAR,
  CLASSIFY_RESET_STATE_TASK_CLASSIFY,
  CLASSIFY_SINGLE_SELECT_LAYOUT_DEFINITION,
  CLASSIFY_SAVING_SINGLE_TASK,
  CLASSIFY_SAVED_SUCCESS_SINGLE_TASK,
  CLASSIFY_SAVED_ERROR_SINGLE_TASK,
  CLASSIFY_SINGLE_UPDATE_NEXT_TASK
} from "../constants/classify_constants";
import { BPMN_PROCESS_KEY, APP_NAME, BPMN_ENDPOINT } from "../../../../constants";
import { setDocInfo } from "../../../LayoutHeaderInfo/actionCreator";

import { getLayoutDefinitions } from "./layout_definition_action";

export const resetStateTaskClassify = value => ({
  type: CLASSIFY_RESET_STATE_TASK_CLASSIFY
});

export const closeSnackBar = index => ({
  type: CLASSIFY_SINGLE_CLOSE_SNACKBAR
});

export const updateNextTask = () => ({
  type: CLASSIFY_SINGLE_UPDATE_NEXT_TASK
});

export const selectLayoutDefinition = layout => ({
  type: CLASSIFY_SINGLE_SELECT_LAYOUT_DEFINITION,
  selected_layout_definition: layout
});

export const getDataDefinitionsForClassify = project_id => async dispatch => {
  await dispatch(getLayoutDefinitions(project_id));

  return dispatch({ type: CLASSIFY_SINGLE_GET_DONE_DATA_DEFINITION });
};

function handleSuccess(dispatch, response, project_id, username, history) {
  const data = response.data;
  if (!data) {
    throw new Error("productions.classify.there_are_no_more_tasks_to_do");
  }

  if (username !== data.assignee) {
    throw new Error("Error");
  }

  const data_task = data.variables[0].value;

  history.push(
    `/classifying/1/false/${project_id}/${data_task.batch_id}/${data_task.id}/${data.taskDefinitionKey}/${data.id}`
  );

  dispatch(
    setDocInfo({
      batch_name: data_task.batch_name,
      doc_uri: data_task.s2_url
    })
  );

  return dispatch({
    type: CLASSIFY_RESPONSE_SINGLE_TASK,
    data_task: data_task,
    show_error: false,
    is_empty_task: false,
    status_text: ""
  });
}

export const getTask = (
  project_id,
  task_key_def,
  task_id,
  username,
  history
) => async (dispatch, getState) => {
  if (
    getState().production.classify.classify_single.is_fetching_task_classify
  ) {
    return;
  }
  dispatch({ type: CLASSIFY_REQUEST_SINGLE_TASK });

  let api;
  if (task_id) {
    api = axios.get(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_id}`);
  } else {
    api = axios.patch(
      `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${task_key_def}/claim`,
      { user_name: username }
    );
  }

  return api
    .then(response =>
      handleSuccess(dispatch, response, project_id, username, history)
    )
    .catch(error =>
      dispatch({
        type: CLASSIFY_RESPONSE_SINGLE_TASK,
        show_error: true,
        is_empty_task: true,
        status_text: error.message
      })
    );
};

export const saveTask = (
  username,
  project_id,
  doc_id,
  task_def_key,
  task_id,
  next_task,
  history
) => async (dispatch, getState) => {
  let is_group_classify = getState().project.project_item.project && getState().project.project_item.project.is_group_classify;
  const {
    selected_layout_definition,
    is_saving
  } = getState().production.classify.classify_single;

  if (!selected_layout_definition) {
    return dispatch({
      type: CLASSIFY_SINGLE_SHOW_SNACKBAR,
      status_text: "productions.classify.please_select_a_layout"
    });
  }

  if (is_saving) {
    return;
  }

  dispatch({ type: CLASSIFY_SAVING_SINGLE_TASK });

  try {
    await axios.patch(`/apps/${APP_NAME}/projects/${project_id}/documents/${doc_id}`, {
      layout_name: selected_layout_definition.name,
      classify: {
        classifier: username,
        task_id: task_id,
        task_def_key: task_def_key,
        layout_name: selected_layout_definition.name
      }
    });
    if (is_group_classify) {
      await axios.patch(
        `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_id}/complete`
        , {
          [`${task_def_key}_output_data`]: {
            value: {
              type: "classify",
              username,
              layout_name: selected_layout_definition.name
            }
          }
        });
    }
    else {
      await axios.patch(
        `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_id}/complete`
        , {
          [`${task_def_key}_output_data`]: {
            value: selected_layout_definition.name
          }
        });
    }

    if (!next_task) {
      history.push(
        `/classifying/1/false/${project_id}/0/0/${task_def_key}`
      );

      return dispatch({ type: CLASSIFY_SAVED_SUCCESS_SINGLE_TASK });
    }

    dispatch({ type: CLASSIFY_SAVED_SUCCESS_SINGLE_TASK });

    return dispatch(
      getTask(project_id, task_def_key, /*task_id*/ null, username, history)
    );
  } catch (error) {
    console.log(error);

    return dispatch({
      type: CLASSIFY_SAVED_ERROR_SINGLE_TASK,
      status_text: error.message
    });
  }
};
