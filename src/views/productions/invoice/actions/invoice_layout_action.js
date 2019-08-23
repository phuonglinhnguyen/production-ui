import axios from 'axios';

import { errorCall } from '../../../../components/common/ajax/call_ajax/actions/call_ajax_action';
import { getFieldsBySections } from './invoice_utility';
import { getTask } from './invoice_task_action';

import {
  INVOICE_RECEIVE_LAYOUT_DEFINITION,
  INVOICE_REQUEST_LAYOUT_DEFINITION,
  KEY_ACTION_KEYING
} from '../constants/invoice_constant';
import { APP_NAME } from '../../../../constants';

const callAPIGetLayout = (project_id, layout_name, attributes) => {
  return axios.get(
    `/apps/${APP_NAME}/projects/${project_id}/section-definitions?layout_name=${layout_name}&attributes=${attributes}`
  );
};

const getLayoutDefinition = (params, username, history) => async (
  dispatch,
  getState
) => {
  if (getState().production.keying_invoice.section_definitions.is_calling) {
    return;
  }
  const { projectId, layoutName, taskKeyDef, action } = params;
  dispatch({
    type: INVOICE_REQUEST_LAYOUT_DEFINITION
  });
  try {
    let attributes = 'position,visible,disable';
    if (action === KEY_ACTION_KEYING) {
      attributes += ',double_typing';
    }
    const response = await callAPIGetLayout(projectId, layoutName, attributes);
    const data = response.data;
    const { fields, section_name } = getFieldsBySections(
      data,
      action === KEY_ACTION_KEYING
    );
    dispatch({
      type: INVOICE_RECEIVE_LAYOUT_DEFINITION,
      datas: data,
      fields: fields,
      section_name: section_name
    });
    if (taskKeyDef.split('/')[1]) {
      dispatch(getTask(username, params, history));
    }
    return;
  } catch (error) {
    dispatch({
      type: INVOICE_RECEIVE_LAYOUT_DEFINITION,
      datas: [],
      fields: []
    });
    return dispatch(errorCall(error.message));
  }
};

export { getLayoutDefinition };
