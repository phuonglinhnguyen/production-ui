import * as types from "../constants/group_images_constants";
import axios from "axios";
import clone from "clone";

import { getCompleteReason } from "../../keys/actions/ulti";
import { BPMN_PROCESS_KEY, BPMN_ENDPOINT, APP_NAME } from "../../../../constants";
import { crudUpdate } from "@dgtx/coreui";
import { KEYING_TASK } from "../../../../providers/resources";

export const closeSnackBar = () => ({
  type: types.GROUP_IMAGES_CLOSE_SNACKBAR
});

export const updateNextTask = () => ({
  type: types.GROUP_IMAGES_CHANGE_NEXT
});

function handleSuccess(dispatch, response) {
  let data_tasks;
  try {
    const { id, variables } = response.data;
    let input_data;
    let complete_reason;
    for (let i = 0; i < variables.length; i++) {
      let variable = variables[i];
      if (variable.name === "input_data") {
        input_data = variable;
      } else if (variable.name === "complete_option") {
        complete_reason = getCompleteReason(variable.value);
      }
    }

    let size = 0;
    if (input_data) {
      data_tasks = input_data.value[0];
      data_tasks.id = id;
      size = data_tasks.images.length;

      if (size > 0) {
        data_tasks.images.forEach(image => {
          image.image_name = image.image_fs.split(/(\\|\/)/g).pop();
        });
      }
    }

    if (size < 1) {
      throw new Error("productions.classify.there_are_no_more_tasks_to_do");
    }

    return dispatch({
      type: types.GROUP_IMAGES_SET_TASK,
      is_empty: false,
      complete_reason,
      data_tasks,
      data_tasks_length: size
    });
  } catch (error) {
    throw new Error(error);
  }
}

export const getTask = (project_id, task_key_def, username) => async (
  dispatch,
  getState
) => {
  if (getState().production.group_images.is_getting) {
    return;
  }

  dispatch({ type: types.GROUP_IMAGES_GET_TASK });
  return axios
    .patch(
      `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/process-definition/key/${BPMN_PROCESS_KEY}/tasks/key/${task_key_def}/claim`,
      { user_name: username }
    )
    .then(response => handleSuccess(dispatch, response))
    .catch(error =>
      dispatch({
        type: types.GROUP_IMAGES_SET_TASK,
        is_show_error: true,
        is_empty: true,
        status_text: error.message
      })
    );
};

export const clickImage = index => async (dispatch, getState) => {
  const datas = clone(getState().production.group_images.datas);
  const data = datas.images[index];
  data.is_checked = !data.is_checked;

  const groups = [];

  // let n = 0;
  // let m = 0;
  // let is_ok = true;
  datas.images.forEach((e, i) => {
    if (e.is_checked) {
      const length = groups.length;
      if (length === 0) {
        groups.push({ start: i, end: 0 });
      } else {
        const last = groups[length - 1];
        last.end = i - last.start + last.start - 1;

        groups.push({ start: i, end: 0 });
      }
    }
  });

  if (groups.length > 0) {
    groups[groups.length - 1].end = datas.images.length - 1;
  }

  return dispatch({
    type: types.GROUP_IMAGES_CHECK_IMAGE,
    datas,
    groups
  });
};

export const saveTask = (username, project_id, task_key_def, reason) => async (
  dispatch,
  getState
) => {
  const {
    is_empty,
    is_saving,
    groups,
    datas,
    next
  } = getState().production.group_images;

  if (is_empty || is_saving) {
    return;
  }
  if (!reason && (!groups || groups.length < 1)) {
    return dispatch({
      type: types.GROUP_IMAGES_VALID,
      status_text: "Empty"
    });
  }
  dispatch({ type: types.GROUP_IMAGES_SAVING });
  const doc_sets = [];
  if (groups) {
    groups.forEach((group, i) => {
      let doc = {
        doc_uri: datas.images.slice(group.start, group.end + 1).map(item => item.image_fs),
        allocation: [{
          user_allocation: username
        }]
      };
      if (group.reason) {
        doc.layout_name = group.reason;
        doc.classify = [{
          classifyer: username,
          layout_name: group.reason
        }];
      }
      doc_sets.push({
        doc_set_name: group.barcode ? group.barcode : ('' + i),
        docs: [doc]
      });
    });
  }

  const data = {
    [`${task_key_def}_output_data`]: {
      value: {
        type: "batch_allocation",
        complete_reason: reason ? reason.value : null,
        data: [
          {
            batch_name: datas.batch_name,
            doc_sets
          }
        ]
      }
    }
  };
  try {
    dispatch(crudUpdate(KEYING_TASK, { projectId: project_id, taskId: datas.id, data }, {
      onSuccess: () => {
        if (!next) {
          return dispatch({ type: types.GROUP_IMAGES_SAVE_SUCCESS });
        }
        dispatch({ type: types.GROUP_IMAGES_SAVE_SUCCESS });
        return dispatch(getTask(project_id, task_key_def, username));
      },
      onFailure: ({ result }) => {
        return dispatch({
          type: types.GROUP_IMAGES_SAVE_ERROR,
          status_text: result.body.Error
        });
      }
    }))
  } catch (error) {
    return dispatch({
      type: types.GROUP_IMAGES_SAVE_ERROR,
      status_text: error.message
    });
  }
};

export const changeBarcode = (index, value) => async (dispatch, getState) => {
  const groups = clone(getState().production.group_images.groups);
  const data = groups[index];
  data.barcode = value;

  return dispatch({
    type: types.GROUP_IMAGES_CHANGE_BARCODE,
    groups
  });
};

export const selectReason = (index, value) => async (dispatch, getState) => {
  const groups = clone(getState().production.group_images.groups);
  const data = groups[index];
  data.reason = value;

  return dispatch({
    type: types.GROUP_IMAGES_SELECT_REASON,
    groups
  });
};

export const resetState = () => ({
  type: types.GROUP_IMAGES_RESET_STATE
});

export const showCanvas = (image_name, image_s3) => (dispatch, getState) => {
  return dispatch({
    type: types.GROUP_IMAGES_SHOW_CANVAS,
    image_s3,
    image_name
  });
};

export const hideCanvas = () => ({
  type: types.GROUP_IMAGES_HIDE_CANVAS
});
