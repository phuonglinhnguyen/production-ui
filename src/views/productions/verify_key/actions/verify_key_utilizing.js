import {
  VERIFY_KEY_SET_FOCUS_RECORD,
  VERIFY_KEY_UPDATE_ERROR_DOCUMENT
} from '../constants/verify_key_contants';

import {
  KEY_VALIDATION,
  KEY_PATTERN
} from '../../../../constants/field_constants';

import {
  KEY_VALIDATION_SCRIPT,
  KEY_VALIDATION_ARGUMENTS
} from '../../../../constants/validation_constants';

import {
  KEY_PATTERN_CONTENT,
  KEY_PATTERN_DESCRIPTION
} from '../../../../constants/pattern_constants';

import { focusUnVerifyField } from './verify_key_data_action';
import { openRespondSnackbar } from '../../../shares/Snackbars/actionCreator';
import _ from 'lodash';



export const handleTestValidation = (
  value: string,
  field_preview: Object,
  script: string,
  validation_arguments: Object,
  apply_layout: false
) => {
  try {
    let input = 'value';
    let parameters = [];
    parameters.push(value);
    if (apply_layout) {
      input = input + `,record_data`;
      parameters.push(field_preview);
    } else {
      Object.keys(validation_arguments).forEach(variable => {
        input = input + ',' + variable;
        parameters.push(field_preview[validation_arguments[variable]] || '');
      });
    }
    // eslint-disable-next-line no-new-func
    var fnc = new Function(`${input}`, `${script}`);
    var result = fnc.apply(this, parameters);
    return result;
  } catch (error) {
    return [
      {
        type: 'error',
        message: error.message
      }
    ];
  }
};


/**
 * description : compare data
 * @param {object} keyed_data
 * @param {object} keyed_data_2
 */
const compareData = (
  keyed_data: object,
  keyed_data_2: object,
  field_definitions: Array<object>
) => (dispatch: any) => {
  // let arr_task = _.difference(Object.keys(keyed_data), ["diff_keyed_data"]);
  let omit_object = ['keyer', 'section'];
  let data_document = [];
  let data_final = [];
  let error_document = [];
  for (let key_record in keyed_data) {
    let record_1 = keyed_data[key_record].keyed_data
      ? _.omit(keyed_data[key_record].keyed_data, omit_object)
      : {};
    let record_2 = keyed_data_2[key_record].keyed_data
      ? _.omit(keyed_data_2[key_record].keyed_data, omit_object)
      : {};
    let data_document_record = {};
    let error_document_record = {};
    let data_final_record = {
      total_fields: Object.keys(record_1).length
    };
    let total_different = 0;

    for (let key_field in field_definitions) {
      const field_name = field_definitions[key_field].name;
      let field_value_1 = record_1[field_name] || '';
      let field_value_2 = record_2[field_name] || '';
      if (field_value_1 === field_value_2) {
        data_document_record[field_name] = {
          value_1: field_value_1,
          value_2: field_value_2,
          different: 0
        };
        error_document_record[field_name] = null;
        data_final_record[field_name] = field_value_1;
        total_different++;
      } else {
        data_document_record[field_name] = {
          value_1: field_value_1,
          value_2: field_value_2,
          different: 1
        };
        error_document_record[field_name] = null;
        data_final_record[field_name] = null;
      }
    }
    data_final_record.total_different = total_different;
    data_document.push(data_document_record);
    data_final.push(data_final_record);
    error_document.push(error_document_record);
  }
  if (data_final.length === 0) {
    data_final.push({});
  }
  return {
    data_final: data_final,
    data_document: data_document,
    error_document: error_document
  };
};
/**
 * description : parse data get from workflow to value
 * @param {Array<object>} variables
 */
const parseResponseToData = variables => {
  let doc = variables.filter(_v => (_v.name = 'input_data'))[0];
  if (!doc || !doc.value) {
    return null;
  }
  return doc.value;
};
/**
 * description : Check error exist
 * @param {Array<object>} errors
 */
const checkErrorExist = (errors: Array<object>) => (dispatch, getState) => {
  const fields = getState().production.verify_key.field_definitions.data;
  const field_required = getState().production.verify_key.field_definitions
    .field_required;

  const data_final = getState().production.verify_key.verify_key.data_final;
  for (let record_index in data_final) {
    if (data_final.hasOwnProperty(record_index)) {
      let record = data_final[record_index];
      for (var key_field in field_required) {
        if (field_required.hasOwnProperty(key_field)) {
          let field_item = field_required[key_field];
          errors = dispatch(
            checkValidation(record, record_index, field_item.name, errors)
          );
        }
      }
    }
  }
  dispatch({
    type: VERIFY_KEY_UPDATE_ERROR_DOCUMENT,
    error_document: errors
  });
  for (let key_err in errors) {
    if (errors.hasOwnProperty(key_err)) {
      const record_err = errors[key_err];
      const field_name = _.findKey(record_err, _e => _e);
      if (field_name) {
        const field_item =
          _.filter(fields, _.matches({ name: field_name }))[0] || {};
        dispatch({
          type: VERIFY_KEY_SET_FOCUS_RECORD,
          focus_record: parseInt(key_err, 10),
          focus_field_name: field_name,
          positions: field_item.position || {}
        });
        return true;
      }
    }
  }
  return false;
};
/**
 * description : Check if data not verify
 * @param {Array<object>} data_final
 * @param {string} username
 * @param {string} section
 */
const checkUnVerify = (
  data_final,
  username,
  section,
  task_def_key,
  task_id,
  ip
) => dispatch => {
  let records_db = [];
  let records_workflow = [];
  for (let record_index in data_final) {
    if (data_final.hasOwnProperty(record_index)) {
      let record = data_final[record_index];
      if (record.total_different !== record.total_fields) {
        dispatch(focusUnVerifyField(parseInt(record_index, 10)));
        dispatch(openRespondSnackbar('productions.verify_key.please_complete'));
        return;
      } else {
        const result = _.omit(record, ['total_different', 'total_fields']);
        records_db.push({
          keyed_data: {
            keyer: username,
            source: null,
            reason: null,
            section,
            task_def_key,
            task_id,
            ip,
            ...result
          }
        });
        records_workflow.push({ keyed_data: { ...result } });
      }
    }
  }
  return { records_db: records_db, records_workflow: records_workflow };
};

const checkPattern = (pattern, value, error_text, error_value) => {
  try {
    error_value = !new RegExp(pattern, 'g').test(value || '')
      ? error_text
      : error_value;
    return error_value;
  } catch (error) {
    return error_value;
  }
};

const checkValidation = (
  record: object,
  record_index: Number,
  field_name: string,
  error_document: Array<object>
) => (dispatch: any, getState: any) => {
  const field_item =
    getState().production.verify_key.field_definitions.data.filter(
      v => v.name === field_name
    )[0] || {};

  if (!field_item) {
    return error_document;
  }

  let error_value = '';
  if (_.has(field_item, [[KEY_VALIDATION], [KEY_VALIDATION_SCRIPT]])) {
    const {
      [KEY_VALIDATION_SCRIPT]: expression,
      [KEY_VALIDATION_ARGUMENTS]: arguments_details
    } = field_item[KEY_VALIDATION];
    error_value = handleTestValidation(
      record[field_name],
      record,
      expression,
      arguments_details
    );
  }

  if (_.has(field_item, [[KEY_PATTERN], [KEY_PATTERN_CONTENT]])) {
    const pattern = field_item[KEY_PATTERN][KEY_PATTERN_CONTENT];
    error_value = checkPattern(
      pattern,
      record[field_name],
      field_item[KEY_PATTERN][KEY_PATTERN_DESCRIPTION],
      error_value
    );
  }

  let error_record = { ...error_document[record_index] } || {};
  error_record[field_name] = error_value;
  error_document[record_index] = error_record;
  return error_document;
};

export {
  compareData,
  checkErrorExist,
  checkUnVerify,
  parseResponseToData,
  checkPattern,
  checkValidation
};
