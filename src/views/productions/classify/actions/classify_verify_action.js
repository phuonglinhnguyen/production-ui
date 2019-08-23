import axios from "axios";
import clone from "clone";
import {
  CLASSIFY_VERIFY_UPDATE_NEXT_TASK,
  CLASSIFY_VERIFY_CHANGE_DISPLAY_TYPE,
  CLASSIFY_VERIFY_GET_DONE_DATA_DEFINITION,
  CLASSIFY_VERIFY_SELECT_INDEX_DOCUMENT,
  CLASSIFY_VERIFY_SELECT_LAYOUT_DEFINITION,
  CLASSIFY_VERIFY_CHANGE_APPROVED,
  CLASSIFY_SHOW_CANVAS,
  CLASSIFY_HIDE_CANVAS,
  CLASSIFY_REQUEST_VERIFY_TASK,
  CLASSIFY_RESPONSE_VERIFY_TASK,
  CLASSIFY_VERIFY_CLOSE_SNACKBAR,
  // CLASSIFY_VERIFY_SHOW_SNACKBAR,
  CLASSIFY_SAVING_VERIFY_TASK,
  CLASSIFY_SAVED_SUCCESS_VERIFY_TASK,
  CLASSIFY_SAVED_ERROR_VERIFY_TASK,
  CLASSIFY_RESET_STATE_VERIFY_TASK_CLASSIFY
} from "../constants/classify_constants";
import { BPMN_PROCESS_KEY, BPMN_ENDPOINT, APP_NAME } from "../../../../constants";

import { getLayoutDefinitions } from "./layout_definition_action";

export const updateNextTask = () => ({
  type: CLASSIFY_VERIFY_UPDATE_NEXT_TASK
});

export const closeSnackBar = index => ({
  type: CLASSIFY_VERIFY_CLOSE_SNACKBAR
});

export const changeDisplayType = type => dispatch => {
  localStorage.setItem(CLASSIFY_VERIFY_CHANGE_DISPLAY_TYPE, type);
  dispatch({
    type: CLASSIFY_VERIFY_CHANGE_DISPLAY_TYPE
  });
};

/**
 * Load when page load first tiem
 */
export const getDataDefinitionsForClassify = project_id => async dispatch => {
  await dispatch(getLayoutDefinitions(project_id));

  let is_display_list =
    (localStorage.getItem(CLASSIFY_VERIFY_CHANGE_DISPLAY_TYPE) || "grid") ===
    "list";

  return dispatch({
    type: CLASSIFY_VERIFY_GET_DONE_DATA_DEFINITION,
    is_display_list
  });
};

/**
 * Layout
 */
export const selectIndexDocument = i => (dispatch, getState) => {
  const { data_tasks } = getState().production.classify.classify_verify;

  return dispatch({
    type: CLASSIFY_VERIFY_SELECT_INDEX_DOCUMENT,
    selected_document: data_tasks[i],
    selected_index_document: i,
    show_canvas: false
  });
};

export const selectLayoutDefinition = (layout_definition, is_all) => (
  dispatch,
  getState
) => {
  const {
    show_canvas,
    selected_index_document,
    data_tasks_length,
    data_tasks
  } = getState().production.classify.classify_verify;

  let datas = clone(data_tasks);
  if (is_all) {
    datas.forEach(function(data) {
      data.layout = layout_definition;
    });
  } else {
    datas[selected_index_document].layout = layout_definition;
  }

  if (selected_index_document + 1 < data_tasks_length) {
    dispatch({
      type: CLASSIFY_VERIFY_SELECT_LAYOUT_DEFINITION,
      selected_document: datas[selected_index_document],
      data_tasks: datas
    });

    const index = selected_index_document + 1;
    if (!show_canvas) {
      document.getElementById(`classify_img_${index}`).scrollIntoView({
        block: "start",
        behavior: "smooth"
      });
      dispatch(selectIndexDocument(index));
    } else {
      dispatch(showDocSelected(index));
    }

    document.getElementById(`classify_table_${index}`).scrollIntoView({
      block: "start",
      behavior: "smooth"
    });
  } else {
    return dispatch({
      type: CLASSIFY_VERIFY_SELECT_LAYOUT_DEFINITION,
      selected_document: datas[selected_index_document],
      data_tasks: datas
    });
  }
};

/**
 * List data
 */
export const changeAllApproved = value => (dispatch, getState) => {
  const data_tasks = clone(
    getState().production.classify.classify_verify.data_tasks
  );

  data_tasks.forEach(data => {
    data.approved = value;
  });

  return dispatch({
    type: CLASSIFY_VERIFY_CHANGE_APPROVED,
    data_tasks
  });
};

export const changeApproved = index => (dispatch, getState) => {
  const data_tasks = clone(
    getState().production.classify.classify_verify.data_tasks
  );
  const data = data_tasks[index];
  data.approved = !data.approved;

  return dispatch({
    type: CLASSIFY_VERIFY_CHANGE_APPROVED,
    data_tasks
  });
};

export const showDocSelected = index => (dispatch, getState) => {
  const { data_tasks } = getState().production.classify.classify_verify;
  if (index !== -1) {
    return dispatch({
      type: CLASSIFY_SHOW_CANVAS,
      selected_document: data_tasks[index],
      selected_index_document: index,
      show_canvas: true
    });
  }
};

export const hideDocSelected = () => ({
  type: CLASSIFY_HIDE_CANVAS
});

function handleSuccess(dispatch, username, response, history) {
  let data_tasks = [];

  try {
    const data = response.data;

    if (Array.isArray(data)) {
      data.forEach(function(element) {
        let id, s2_url, doc_name, layout_name;
        try {
          for (let i = 0; i < element.variables.length; i++) {
            let variable = element.variables[i];
            if (variable.name === "input_data") {
              id = variable.value.id;
              s2_url = variable.value.s2_url[0];
              layout_name = variable.value.layout_name;

              break;
            }
          }
        } catch (error) {
          console.log("####ERROR######");
          console.log(error);
          console.log(element);
          console.log("####ERROR######");
        }

        data_tasks.push({
          task_id: element.id,
          task_name: element.name,
          layout_name: layout_name,
          doc_id: id,
          s2_url: s2_url,
          doc_name: doc_name
        });
      }, this);
    } else {
      if (username !== data.assignee) {
        throw new Error("Error");
      }

      const docs = data.variables[0].value.docs;
      const url = data.variables[1].value;

      data_tasks = docs;

      history.push(`/${url}/${data.id}`);
    }

    const size = data_tasks.length;
    if (size < 1) {
      throw new Error("productions.classify.there_are_no_more_tasks_to_do");
    }

    return dispatch({
      type: CLASSIFY_RESPONSE_VERIFY_TASK,
      data_tasks: data_tasks,
      data_tasks_length: size
    });
  } catch (error) {
    throw new Error(error);
  }
}

export const getTask = (
  project_id,
  doc_size,
  task_key_def,
  task_id,
  username,
  history
) => async (dispatch, getState) => {
  if (
    getState().production.classify.classify_verify.is_fetching_task_classify
  ) {
    return;
  }
  dispatch({ type: CLASSIFY_REQUEST_VERIFY_TASK });

  let api;
  if (task_id) {
    api = axios.get(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_id}`);
  } else {
    api = axios.patch(
     `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${task_key_def}/claim?maxResult=${doc_size}`,
      { user_name: username }
    );
  }

  return api
    .then(response => handleSuccess(dispatch, username, response, history))
    .catch(error =>
      dispatch({
        type: CLASSIFY_RESPONSE_VERIFY_TASK,
        show_error: true,
        status_text: error.message
      })
    );
};

function parseDataBeforeComplete(task_def_key, task_id, data_tasks, username) {
  let document_ids = "";
  let data_layouts = [];

  let datas = [];

  data_tasks.forEach(function(data_task) {
    datas.push({
      id: data_task.task_id,
      output_data: {
        [`${task_def_key}_output_data`]: {
          value: {
            approved: data_task.approved,
            type:"verify_classify"
          }
        }
      }
    });

    document_ids += data_task.doc_id + ",";
    data_layouts.push({
      classify: [
        {
          classifier: username,
          approved: data_task.approved,
          task_id: task_id,
          task_def_key: task_def_key
        }
      ]
    });
  }, this);

  document_ids = document_ids.replace(/.$/, "");
  return { datas, document_ids, data_layouts };
}

export const saveTask = (
  username,
  doc_size,
  project_id,
  task_def_key,
  task_id,
  next_task,
  history
) => async (dispatch, getState) => {
  const {
    is_saving,
    data_tasks
  } = getState().production.classify.classify_verify;
  if (is_saving) {
    return;
  }

  const { datas, document_ids, data_layouts } = parseDataBeforeComplete(
    task_def_key,
    task_id,
    data_tasks,
    username
  );

  dispatch({ type: CLASSIFY_SAVING_VERIFY_TASK });

  try {
    await axios.patch(
      `apps/${APP_NAME}/projects/${project_id}/documents?ids=${document_ids}`,
      data_layouts
    );
    if (task_id) {
      await axios.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_id}/complete`, datas);
    } else {
      await axios.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/complete`, datas);
    }

    if (!next_task) {
      history.push(
        `/verifying/classifying/${doc_size}/true/${project_id}/0/0/${task_def_key}`
      );

      return dispatch({ type: CLASSIFY_SAVED_SUCCESS_VERIFY_TASK });
    }

    dispatch({ type: CLASSIFY_SAVED_SUCCESS_VERIFY_TASK });

    return dispatch(
      getTask(
        project_id,
        doc_size,
        task_def_key,
        /*task_id*/ null,
        username,
        history
      )
    );
  } catch (error) {
    console.log(error);

    return dispatch({
      type: CLASSIFY_SAVED_ERROR_VERIFY_TASK,
      status_text: error.message
    });
  }
};

export const resetStateTaskClassify = () => ({
  type: CLASSIFY_RESET_STATE_VERIFY_TASK_CLASSIFY
});
