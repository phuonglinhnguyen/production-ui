import clone from "clone";
import axios from "axios";
import Shape from "../../../../components/common/canvas/modules/shape";
import {
  OMR_REQUEST_TASK,
  OMR_RESPONSE_TASK,
  OMR_GET_DONE_DATA_DEFINITION,
  OMR_SAVING_TASK,
  OMR_SAVED_SUCCESS_TASK,
  OMR_SAVED_ERROR_TASK,
  OMR_RESET_STATE_TASK,
  OMR_UPDATE_NEXT_TASK,
  OMR_CLOSE_SNACKBAR
} from "../constants";
import { BPMN_PROCESS_KEY, COMPONENT_RADIO, APP_NAME, BPMN_ENDPOINT } from "../../../../constants";
import { setDocInfo } from "../../../LayoutHeaderInfo/actionCreator";

export const resetStateTask = value => ({
  type: OMR_RESET_STATE_TASK
});

export const closeSnackBar = index => ({
  type: OMR_CLOSE_SNACKBAR
});

export const updateNextTask = () => ({
  type: OMR_UPDATE_NEXT_TASK
});

/**
 * event when page load first
 */

export const getDataDefinitions = (
  project_id,
  layout_name,
  section_name
) => async dispatch => {
  try {
    const layouts = await axios
      .get(`apps/${APP_NAME}/projects/${project_id}/layout-definitions?includes=name`)
      .then(res => {
        const data = res.data;
        return data.filter(layout => layout.name === layout_name);
      });

    const sections = await axios
      .get(`apps/${APP_NAME}/layout-definitions/${layouts[0].id}/section-definitions`)
      .then(res => {
        const data = res.data;
        return data.filter(section => section.name === section_name);
      });

    const fields = await axios
      .get(
        `apps/${APP_NAME}/projects/${project_id}/field-value-definitions?layout_name=${layout_name}&section_name=${section_name}&position=1`
      )
      .then(res => res.data);

    let section = null;
    if (sections.length > 0) {
      section = sections[0];
      const field_in_sections = section.fields;
      field_in_sections.forEach(function(field_in_section) {
        const field = fields.find(f => f.id === field_in_section.field_id);
        if (field) {
          field_in_section.name = field.name;
          field_in_section.field_display = field.field_display;
          field_in_section.control_type = field.control_type;
        }

        const argument_details = field_in_section.argument_details;
        argument_details.forEach(function(argument_detail) {
          const { x, y, w, h } = argument_detail.position;
          argument_detail.shape = new Shape(x, y, w, h);
        }, this);
      }, this);
      const { x, y, w, h } = section.position;
      section.shape = new Shape(x, y, w, h);
    }

    return dispatch({
      type: OMR_GET_DONE_DATA_DEFINITION,
      section
    });
  } catch (error) {
    return dispatch({
      type: OMR_GET_DONE_DATA_DEFINITION,
      show_error: true,
      status_text: error.message
    });
  }
};

/**
 * Get task
 */
function handleSuccess(dispatch, response, props, section) {
  const data = response.data;
  if (!data) {
    throw new Error("productions.classify.there_are_no_more_tasks_to_do");
  }
  props.history.push(
    `/${props.first_url}/${props.project_id}/${props.layout_name}/${
      props.section_name
    }/${props.task_def_key}/${data.id}`
  );

  const value = data.variables[0].value;
  const _section = clone(section);

  let s2_url, doc_id, batch_name;
  if (value.hasOwnProperty("doc")) {
    doc_id = value.doc.id;
    s2_url = value.doc.s2_url;
    batch_name = value.doc.batch_name;

    const values = [];
    Object.keys(value).forEach(function(key) {
      if (key.includes("output_data")) {
        values.push(value[key]);
      }
    });

    if (values.length > 0) {
      _section.fields.forEach(function(field) {
        let value1 = values[0][field.name],
          value2 = values[1][field.name];

        if (value1 && value1 === value2) {
          let value = "";
          if (field.control_type === COMPONENT_RADIO) {
            let l = field.argument_details.length;
            for (let index = 0; index < l; index++) {
              let argument_detail = field.argument_details[index];
              if (argument_detail.value === value1) {
                argument_detail.shape.checked = true;
                value = argument_detail.value;
                break;
              }
            }
          } else {
            const arrs = value1.split("/");
            field.argument_details.forEach(function(argument_detail) {
              if (arrs.includes(argument_detail.value)) {
                argument_detail.shape.checked = true;
                value = value + `${argument_detail.value}|`;
              }
            });
            value = value.slice(0, -1);
          }

          if (value) {
            field.value = value;
            field.is_not_empty = true;
          }
        }
        field.value_output_one = value1;
        field.value_output_two = value2;
      });
    }
  } else {
    doc_id = value.id;
    s2_url = value.s2_url;
  }

  dispatch(
    setDocInfo({
      batch_name: batch_name,
      doc_uri: s2_url
    })
  );

  return dispatch({
    type: OMR_RESPONSE_TASK,
    data_task: {
      doc_id: doc_id,
      s2_url: s2_url,
      section: _section
    }
  });
}

export const getTask = props => async (dispatch, getState) => {
  const { is_fetching_task_omr, section } = getState().production.omr;
  if (is_fetching_task_omr) {
    return;
  }

  dispatch({ type: OMR_REQUEST_TASK });

  let api;
  if (props.task_id) {
    api = axios.get(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${props.project_id}/tasks/${props.task_id}`);
  } else {
    api = axios.patch(
      `${
        BPMN_ENDPOINT
      }/apps/${
        APP_NAME
      }/projects/${
        props.project_id
      }/process-definition/key/${
        BPMN_PROCESS_KEY
      }/tasks/key/${
        props.task_def_key
      }/claim`,
      { user_name: props.username }
    );
  }

  return api
    .then(response => handleSuccess(dispatch, response, props, section))
    .catch(error =>
      dispatch({
        type: OMR_RESPONSE_TASK,
        data_task: null,
        show_error: true,
        is_empty_task: true,
        status_text: error.message
      })
    );
};

export const selectRectangle = (
  field_index,
  value_index,
  checked,
  data_task
) => dispatch => {
  const task_clone = clone(data_task);

  if (typeof field_index !== "number" || field_index < 0) {
    return;
  }

  const field = task_clone.section.fields[field_index];
  const l = field.argument_details.length;

  if (field.control_type === COMPONENT_RADIO) {
    for (let index = 0; index < l; index++) {
      field.argument_details[index].shape.checked = false;
    }

    if (checked) {
      let argument_detail = field.argument_details[value_index];
      argument_detail.shape.checked = true;
      field.value = argument_detail.value;
    } else {
      field.value = "";
    }

    field.is_not_empty = checked;
  } else {
    let value = "";
    for (let index = 0; index < l; index++) {
      let argument_detail = field.argument_details[index];
      if (index === value_index) {
        argument_detail.shape.checked = checked;
      }
      if (argument_detail.shape.checked) {
        value = value + `${argument_detail.value}|`;
      }
    }
    value = value.slice(0, -1);
    field.value = value;
    field.is_not_empty = value.length > 0;
  }

  return dispatch({ type: OMR_RESPONSE_TASK, data_task: task_clone });
};

/**
 * Save task
 */
export const saveTask = (
  username,
  first_url,
  project_id,
  layout_name,
  section_name,
  task_def_key,
  task_id,
  next_task,
  history
) => async (dispatch, getState) => {
  const { is_saving, data_task } = getState().production.omr;

  if (is_saving) {
    return;
  }

  dispatch({ type: OMR_SAVING_TASK });

  try {
    let record = {
      keyer: username,
      section: section_name
    };
    record["task_id"] = task_id;
    record["task_def_key"] = task_def_key;

    const field_value = {};
    data_task.section.fields.forEach(function(element) {
      field_value[element.name] = element.value || "";
    });

    await axios.patch(
      `apps/${APP_NAME}/projects/${project_id}/documents?id=${
        data_task.doc_id
      }&attributes=keyed_data`,
      {
        records: [
          {
            keyed_data: {
              ...record,
              ...field_value
            }
          }
        ]
      }
    );

    await axios.patch(`
    ${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${project_id}/tasks/${task_id}/complete`, {
      [`${task_def_key}_output_data`]: {
        value: field_value
      }
    });

    if (!next_task) {
      history.push(
        `/${first_url}/${project_id}/${layout_name}/${section_name}/${task_def_key}`
      );

      return dispatch({ type: OMR_SAVED_SUCCESS_TASK });
    }

    dispatch({ type: OMR_SAVED_SUCCESS_TASK });

    return dispatch(
      getTask({
        first_url,
        project_id,
        layout_name,
        section_name,
        task_def_key,
        username,
        history
      })
    );
  } catch (error) {
    console.log(error);

    return dispatch({
      type: OMR_SAVED_ERROR_TASK,
      status_text: error.message
    });
  }
};
