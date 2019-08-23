import axios from 'axios';


import { COMPONENT_TEXTFIELD } from '../../../../constants';
import { KEY_CONTROL_TYPE } from '../../../../constants/field_constants';
import {
  KEY_VALIDATION,
  KEY_PATTERN
} from '../../../../constants/field_constants';

import { KEY_VALIDATION_SCRIPT } from '../../../../constants/validation_constants';

import { KEY_PATTERN_CONTENT } from '../../../../constants/pattern_constants';

import {
  VERIFY_KEY_RECIEVE_FIELDS_DEFINITION,
  VERIFY_KEY_REQUEST_FIELDS_DEFINITION,
} from '../constants/verify_key_contants';

import _ from 'lodash';

export const getFieldDefinitions = (
  project_id: string,
  layout_name: string,
  section_name: string
) => async (dispatch: any, getState: any) => {
  const is_fetching = getState().production.verify_key.field_definitions
    .is_fetching;
  if (is_fetching) {
    return;
  }
  dispatch({
    type: VERIFY_KEY_REQUEST_FIELDS_DEFINITION
  });
  try {
    const response = await axios.get(
      `/projects/${project_id}/field-value-definitions?layout_name=${layout_name}&section_name=${section_name}&position=1`
    );
    const result = response.data;
    for (var key in result) {
      if (result.hasOwnProperty(key)) {
        var element = result[key];
        element[KEY_CONTROL_TYPE] = COMPONENT_TEXTFIELD;
        if (
          _.get(element, `${KEY_VALIDATION}.${KEY_VALIDATION_SCRIPT}`) ||
          _.get(element, `${KEY_PATTERN}.${KEY_PATTERN_CONTENT}`)
        ) {
          element.required = true;
        } else {
          element.required = false;
        }
        result[key] = element;
      }
    }
    dispatch({
      type: VERIFY_KEY_RECIEVE_FIELDS_DEFINITION,
      data: result,
      field_required: result.filter(_f => _f.required)
    });
  } catch (error) {
    dispatch({
      type: VERIFY_KEY_RECIEVE_FIELDS_DEFINITION,
      data: [],
      field_required :[]
    });
  }
};