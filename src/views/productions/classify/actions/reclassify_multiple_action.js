import axios from "axios";
import clone from "clone";
import {
  CLASSIFY_MULTIPLE_UPDATE_NEXT_TASK,
  CLASSIFY_MULTIPLE_CHANGE_DISPLAY_TYPE,
  CLASSIFY_MULTIPLE_GET_DONE_DATA_DEFINITION,
  CLASSIFY_MULTIPLE_SELECT_INDEX_DOCUMENT,
  CLASSIFY_MULTIPLE_SELECT_LAYOUT_DEFINITION,
  CLASSIFY_SHOW_CANVAS,
  CLASSIFY_HIDE_CANVAS,
  CLASSIFY_REQUEST_MULTIPLE_TASK,
  CLASSIFY_RESPONSE_MULTIPLE_TASK,
  CLASSIFY_MULTIPLE_CLOSE_SNACKBAR,
  CLASSIFY_MULTIPLE_SHOW_SNACKBAR,
  CLASSIFY_SAVING_MULTIPLE_TASK,
  CLASSIFY_SAVED_SUCCESS_MULTIPLE_TASK,
  CLASSIFY_SAVED_ERROR_MULTIPLE_TASK,
  CLASSIFY_RESET_STATE_MULTIPLE_TASK_CLASSIFY
} from "../constants/classify_constants";
import { BPMN_PROCESS_KEY, APP_NAME, BPMN_ENDPOINT } from "../../../../constants";

import { getLayoutDefinitions } from "./layout_definition_action";
import { guid } from "../../../../@components/vaidationWorker";

export const updateNextTask = () => ({
  type: CLASSIFY_MULTIPLE_UPDATE_NEXT_TASK
});

export const closeSnackBar = index => ({
  type: CLASSIFY_MULTIPLE_CLOSE_SNACKBAR
});

export const changeDisplayType = type => dispatch => {
  localStorage.setItem(CLASSIFY_MULTIPLE_CHANGE_DISPLAY_TYPE, type);
  dispatch({
    type: CLASSIFY_MULTIPLE_CHANGE_DISPLAY_TYPE
  });
};

/**
 * Load when page load first tiem
 */
export const getDataDefinitionsForClassify = project_id => async dispatch => {
  await dispatch(getLayoutDefinitions(project_id));

  let is_display_list =
    (localStorage.getItem(CLASSIFY_MULTIPLE_CHANGE_DISPLAY_TYPE) || "grid") ===
    "list";

  return dispatch({
    type: CLASSIFY_MULTIPLE_GET_DONE_DATA_DEFINITION,
    is_display_list
  });
};

/**
 * Layout
 */
export const selectIndexDocument = i => (dispatch, getState) => {
  const { data_tasks } = getState().production.classify.classify_multiple;

  return dispatch({
    type: CLASSIFY_MULTIPLE_SELECT_INDEX_DOCUMENT,
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
  } = getState().production.classify.classify_multiple;

  let datas = clone(data_tasks);
  if (is_all) {
    const layout = datas[selected_index_document].layout;
    if (!layout) {
      return;
    }
    datas.forEach(function (data) {
      data.layout = layout;
    });
  } else {
    datas[selected_index_document].layout = layout_definition;
  }

  if (selected_index_document + 1 < data_tasks_length) {
    dispatch({
      type: CLASSIFY_MULTIPLE_SELECT_LAYOUT_DEFINITION,
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
      type: CLASSIFY_MULTIPLE_SELECT_LAYOUT_DEFINITION,
      selected_document: datas[selected_index_document],
      data_tasks: datas
    });
  }
};

/**
 * List data
 */
export const showDocSelected = index => (dispatch, getState) => {
  const { data_tasks } = getState().production.classify.classify_multiple;
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

function parseComment(comment) {
  if (!comment) {
    return;
  }
  return comment.filter(item => !!item).map(item => {
    return item.split('#EOL#').join('\n');
  }).join('\n')
}

function handleSuccess(dispatch, username, response, history) {
  let data_tasks = [];

  try {
    const data = response.data;

    if (Array.isArray(data)) {
      data.forEach(function (element) {
        let id, s2_url, doc_name, layout_name_old, comment, batch_name;

        try {
          for (let i = 0; i < element.variables.length; i++) {
            let variable = element.variables[i];
            if (variable.name === "input_data") {
              id = variable.value.id;
              /**multiple images => get fisrt image for classify */
              s2_url = Array.isArray(variable.value.s2_url)?variable.value.s2_url[0]:variable.value.s2_url;
              layout_name_old = variable.value.layout_name;
              batch_name = variable.value.batch_name;
              if (s2_url) {
                doc_name = s2_url.split(/(\\|\/)/g).pop();
              }

              break;
            }
          }
        } catch (error) {
          console.log("####ERROR######");
          console.log(error);
          console.log(element);
          console.log("####ERROR######");
        }
        try {
          comment = parseComment(element.variables.filter(item => item.name === 'comment').pop().value);
        } catch (error) {
          console.log("####ERROR######");
          console.log(error);
          console.log(element);
          console.log("####ERROR######");
        }
        data_tasks.push({
          task_id: element.id,
          task_name: element.name,
          layout_name_old: layout_name_old,
          comment: comment,
          doc_id: id,
          s2_url: s2_url,
          doc_name: doc_name,
          batch_name,
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
      type: CLASSIFY_RESPONSE_MULTIPLE_TASK,
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
    getState().production.classify.classify_multiple.is_fetching_task_classify
  ) {
    return;
  }
  dispatch({ type: CLASSIFY_REQUEST_MULTIPLE_TASK });

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
        type: CLASSIFY_RESPONSE_MULTIPLE_TASK,
        show_error: true,
        status_text: error.message
      })
    );
};

function parseDataBeforeComplete(task_def_key, task_id, data_tasks, username, is_group_classify) {
  let datas = null;
  let document_ids = "";
  let data_layouts = [];
  let is_layout_empty = false;

  if (task_id) {
    let docs = [];

    data_tasks.forEach(function (data_task) {
      if (!data_task.layout) {
        is_layout_empty = true;
        return false;
      }
      docs.push({
        ...data_task,
        layout_name: data_task.layout.name
      });

      document_ids += data_task.id + ",";
      data_layouts.push({
        layout_name: data_task.layout.name,
        classify: {
          classifier: username,
          layout_name: data_task.layout.name,
          task_id: task_id,
          task_def_key: task_def_key,
          task_name: data_task.name
        }
      });
    }, this);
    let group_id = `${guid()}-${Date.now()}`;
    if(is_group_classify) {
      datas = {
        [`${task_def_key}_output_data`]: {
          value: {
            docs: docs,
            group_id,
            username,
            type: "reclassify",
          }
        }
      };
    }
    else {
      datas = {
        [`${task_def_key}_output_data`]: {
          value: {
            docs: docs
          }
        }
      };
    }
  } else {
    datas = [];
    const group_id = `${guid()}-${Date.now()}`;
    data_tasks.forEach(function (data_task) {
      if (!data_task.layout) {
        is_layout_empty = true;
        return;
      }
      if(is_group_classify) {
        datas.push({
          id: data_task.task_id,
          output_data: {
            [`${task_def_key}_output_data`]: {
              value: {
                group_id,
                username,
                type: "reclassify",
                layout_name: data_task.layout.name
              }
            }
          }
        });
      }
      else {
        datas.push({
          id: data_task.task_id,
          output_data: {
            [`${task_def_key}_output_data`]: {
              value: data_task.layout.name
            }
          }
        });
      }

      document_ids += data_task.doc_id + ",";
      data_layouts.push({
        layout_name: data_task.layout.name,
        classify: {
          classifier: username,
          layout_name: data_task.layout.name,
          task_id: data_task.task_id,
          task_def_key: task_def_key
        }
      });
    }, this);
  }

  document_ids = document_ids.replace(/.$/, "");
  return { is_layout_empty, datas, document_ids, data_layouts };
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
  let is_group_classify = getState().project.project_item.project && getState().project.project_item.project.is_group_classify;
  const {
    is_saving,
    data_tasks
  } = getState().production.classify.classify_multiple;
  if (is_saving) {
    return;
  }
  const {
    is_layout_empty,
    datas,
    document_ids,
    data_layouts
  } = parseDataBeforeComplete(task_def_key, task_id, data_tasks, username,is_group_classify);
  if (data_layouts.length === 0) {
    return dispatch({
      type: CLASSIFY_MULTIPLE_SHOW_SNACKBAR,
      status_text:
        "productions.classify.minimun_one_document_must_be_classified_with_a_layout"
    });
  }
  dispatch({ type: CLASSIFY_SAVING_MULTIPLE_TASK });
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
        `/re-classifying/${doc_size}/true/${project_id}/0/0/${task_def_key}`
      );

      return dispatch({ type: CLASSIFY_SAVED_SUCCESS_MULTIPLE_TASK });
    }

    dispatch({ type: CLASSIFY_SAVED_SUCCESS_MULTIPLE_TASK });

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
      type: CLASSIFY_SAVED_ERROR_MULTIPLE_TASK,
      status_text: error.message
    });
  }
};

export const resetStateTaskClassify = () => ({
  type: CLASSIFY_RESET_STATE_MULTIPLE_TASK_CLASSIFY
});
