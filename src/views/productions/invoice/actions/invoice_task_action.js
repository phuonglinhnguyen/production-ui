import axios from "axios";
import clone from "clone";

import {
  createDataDocument,
  createDataToSave,
  getDocInfoFromTaskData,
  mergeDataDocument
} from "./invoice_utility";
import { checkError } from "./invoice_validate";
import { recieveImageUris } from "./invoice_image_action";
import { getTempData } from "./invoice_local_storage_action";
import { actionFocus } from "./invoice_document_private_action";
import {
  completeCall,
  errorCall
} from "../../../../components/common/ajax/call_ajax/actions/call_ajax_action";
import { getCompleteReason } from "../../keys/actions/ulti";
import {
  INVOICE_CLOSE_WARNING_LIST,
  INVOICE_DOCUMENT_RESET_STATE,
  INVOICE_DONE_CLAIM_TASK,
  INVOICE_DONE_CLAIM_TASK_ERROR,
  INVOICE_DONE_SAVE_TASK,
  INVOICE_ERROR_RESET_STATE,
  INVOICE_IMAGE_RESET_STATE,
  INVOICE_OPEN_WARNING_LIST,
  INVOICE_RECIEVE_DOCUMENT_DATA,
  INVOICE_REQUEST_CLAIM_TASK,
  INVOICE_RESET_LAYOUT_DEFINITION,
  INVOICE_SAVING_TASK,
  INVOICE_TASK_RESET_STATE,
  INVOICE_UPDATE_ERROR,
  INVOICE_UPDATE_GET_NEXT_TASK,
  KEY_ACTION_KEYING,
  ROUTE_INVOICE,
  KEY_ACTION_QC
} from "../constants/invoice_constant";
import { KEY_DOUBLE_TYPING } from "../../../../constants/field_constants";
import { BPMN_ENDPOINT, APP_NAME } from "../../../../constants";

const callAPIGetTask = (projectId, taskDefinitionKey, username, action) => {
  return axios.patch(
    `${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/process-definition/key/${action}/tasks/key/${taskDefinitionKey}/claim`,
    {
      username: username
    }
  );
};

const callAPIGetDocById = (projectId, docId) => {
  return axios.get(
    `apps/${APP_NAME}/projects/${projectId}/documents?id=${docId}&attributes=records.ocr_data,s2_url,doc_uri`
  );
};

const callAPIGetKeyedDataById = (projectId, docId) => {
  return axios.get(
    `apps/${APP_NAME}/projects/${projectId}/documents?id=${docId}&attributes=records.keyed_data&position=last`
  );
};

const callAPISaveDocDatabase = (projectId, docId, records) => {
  return axios.patch(
    `apps/${APP_NAME}//projects/${projectId}/documents?id=${docId}&&multiple=true`,
    records
  );
};

const callAPICompleteTask = (projectId, taskId, records) => {
  return axios.patch(`${BPMN_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/tasks/${taskId}/complete`, {
    ...records
  });
};

const handleSuccess = (params, history, taskData, username) => async (
  dispatch,
  getState
) => {
  const { projectId, layoutName, action } = params;
  const { variables, taskDefinitionKey, id: taskId } = taskData;
  let current_url = `${ROUTE_INVOICE}/${projectId}/${action}/${layoutName}/${taskDefinitionKey}`
  let {
    comment,
    completeOption,
    docInfo,
    formUri,
    holdCount,
    keyData
  } = getDocInfoFromTaskData(variables);
  if (!docInfo || !docInfo.id) {
    dispatch({
      type: INVOICE_DONE_CLAIM_TASK_ERROR
    });
    return dispatch(errorCall("Không tồn tại document này"));
  }
  if (current_url !== formUri) {
    history.push(`/${formUri}`);
    dispatch({
      type : INVOICE_RESET_LAYOUT_DEFINITION
    })
    return dispatch(errorCall("Url của bạn không hợp lệ"));
  }
  try {
    const doc_response = await callAPIGetDocById(projectId, docInfo.id);
    const section_defintion = getState().production.keying_invoice
      .section_definitions.datas;

    let data = { document_data: null, error_record: null };
    const section_name = getState().production.keying_invoice
      .section_definitions.section_name;
    if (action === KEY_ACTION_QC) {
      const keyed_data = await callAPIGetKeyedDataById(projectId, docInfo.id);
      keyData = keyed_data.data;
    }
    if (keyData) {
      data = mergeDataDocument(
        section_name,
        keyData[0],
        action !== KEY_ACTION_KEYING
      );
    } else {
      data = createDataDocument(section_defintion);
    }
    dispatch(recieveImageUris(doc_response.data));
    history.push(
      `/${current_url}/${taskId}`
    );
    const complete_reason = completeOption
      ? getCompleteReason(completeOption)
      : [];
    dispatch({
      type: INVOICE_RECIEVE_DOCUMENT_DATA,
      document_data: data.document_data,
      doc_info: {
        doc_id: docInfo.id,
        taskDefinitionKey: taskDefinitionKey,
        task_id: taskId,
        holdCount,
        comment,
        username
      },
      action_type : action,
      complete_reason: complete_reason
    });
    if (holdCount && comment) {
      dispatch(completeCall("productions.keying_invoice.from_verify_bad"));
    }
    dispatch({
      type: INVOICE_UPDATE_ERROR,
      error_detail: null,
      error_record: data.error_record,
      warning_list: []
    });
    dispatch({
      type: INVOICE_DONE_CLAIM_TASK
    });
    const field_item = getState().production.keying_invoice.section_definitions
      .fields[0];
    if (action === KEY_ACTION_KEYING) {
      dispatch(getTempData(username, taskId));
    }
    return dispatch(
      actionFocus(
        0,
        field_item.section_name,
        0,
        field_item.name,
        {},
        {},
        field_item[KEY_DOUBLE_TYPING],
        true
      )
    );
  } catch (error) {
    dispatch({
      type: INVOICE_DONE_CLAIM_TASK_ERROR
    });
    return dispatch(errorCall(error.toString()));
  }
};

const getTask = (username, params, history) => async (dispatch, getState) => {
  if (getState().production.keying_invoice.task_definitions.is_claimming_task) {
    return;
  }
  dispatch({
    type: INVOICE_REQUEST_CLAIM_TASK
  });
  const { projectId, taskKeyDef, action } = params;
  const taskDef = taskKeyDef.split("/")[0];
  try {
    let type_start = action === KEY_ACTION_QC ? "qc" : "start";
    const response = await callAPIGetTask(
      projectId,
      taskDef,
      username,
      type_start
    );
    return dispatch(handleSuccess(params, history, response.data, username));
  } catch (error) {
    dispatch(resetToEmptyState());
    return dispatch(errorCall(error.toString()));
  }
};

const updateNextTask = () => dispatch => {
  return dispatch({
    type: INVOICE_UPDATE_GET_NEXT_TASK
  });
};

const openWarningList = (warning, action) => dispatch => {
  return dispatch({
    type: INVOICE_OPEN_WARNING_LIST,
    action_warning_list: action,
    warning_field: warning
  });
};

const closeWarningList = () => dispatch => {
  return dispatch({
    type: INVOICE_CLOSE_WARNING_LIST
  });
};

const saveInvoiceTask = (
  documentData,
  username,
  isNextTask,
  params,
  history,
  reason
) => async (dispatch, getState) => {
  let fields = clone(
    getState().production.keying_invoice.section_definitions.fields
  );
  const doc_info = getState().production.keying_invoice.invoice_document
    .doc_info;
  const ip = getState().user.user.ip;

  dispatch({
    type: INVOICE_SAVING_TASK
  });
  let information = {
    ip: ip,
    keyer: username,
    task_def_key: doc_info.taskDefinitionKey,
    task_id: doc_info.task_id
  };

  const { database_data, workflow_data } = createDataToSave(
    documentData,
    information,
    fields,
    reason
  );

  try {
    let { projectId, layoutName } = params;
    let { doc_info } = getState().production.keying_invoice.invoice_document;
    let {
      section_name
    } = getState().production.keying_invoice.section_definitions;
    const complete_reason = !reason ? null : reason.value || "";
    let comment = !reason
      ? ""
      : doc_info.comment + `#EOL#${username}:${reason.self_comment}`;
    await callAPISaveDocDatabase(projectId, doc_info.doc_id, database_data);
    await callAPICompleteTask(projectId, doc_info.task_id, {
      [`${doc_info.taskDefinitionKey}_output_data`]: {
        value: {
          comment: comment || "",
          complete_reason: complete_reason,
          complete_reason_title: reason ? reason.label || "" : "",
          completed: !reason ? true : false,
          key_datas: [{ records: workflow_data }],
          user: username,
          hold_count: reason ? doc_info.holdCount + 1 : 0,
          layout_name: layoutName,
          section_name: section_name.join()
        }
      }
    });
    dispatch({
      type: INVOICE_DONE_SAVE_TASK
    });
    dispatch(completeCall("productions.keying_invoice.saved"));
    if (isNextTask) {
      return dispatch(getTask(username, params, history));
    } else {
      return dispatch(resetToEmptyState());
    }
  } catch (error) {
    dispatch({
      type: INVOICE_DONE_SAVE_TASK
    });
  }
};

const saveTask = (username, isNextTask, params, history, reason) => (
  dispatch,
  getState
) => {
  const document = clone(
    getState().production.keying_invoice.invoice_document.document_data
  );
  let error_record = clone(
    getState().production.keying_invoice.invoice_error.error_record
  );
  const {
    record_focused,
    field_focused
  } = getState().production.keying_invoice.invoice_document;

  let warning_list = clone(
    getState().production.keying_invoice.invoice_error.warning_list
  );

  if (
    !reason &&
    dispatch(
      checkError(
        document,
        error_record,
        warning_list,
        record_focused,
        field_focused
      )
    )
  ) {
    return;
  }
  let new_warning_list = clone(
    getState().production.keying_invoice.invoice_error.warning_list
  );
  if (!reason && new_warning_list.length > 0) {
    return dispatch(
      openWarningList([], () =>
        dispatch(
          saveInvoiceTask(document, username, isNextTask, params, history)
        )
      )
    );
  }

  return dispatch(
    saveInvoiceTask(document, username, isNextTask, params, history, reason)
  );
};

const resetToEmptyState = () => dispatch => {
  dispatch({
    type: INVOICE_TASK_RESET_STATE
  });
  dispatch({
    type: INVOICE_ERROR_RESET_STATE
  });
  dispatch({
    type: INVOICE_DOCUMENT_RESET_STATE
  });
  return dispatch({
    type: INVOICE_IMAGE_RESET_STATE
  });
};

const resetState = () => dispatch => {
  dispatch(resetToEmptyState());
  return dispatch({
    type: INVOICE_RESET_LAYOUT_DEFINITION
  });
};

export {
  closeWarningList,
  getTask,
  openWarningList,
  resetState,
  saveTask,
  updateNextTask
};
