import clone from 'clone';
import { findIndex } from 'lodash';

import {
  handleTestValidation,
  handleTestPattern
} from '../../../../utils/fields/field_preview_action';
import { onFocusField } from './invoice_document_action';

import {
  KEY_PATTERN,
  KEY_VALIDATION
} from '../../../../constants/field_constants';
import { KEY_PATTERN_CONTENT } from '../../../../constants/pattern_constants';
import {
  KEY_VALIDATION_ARGUMENTS,
  KEY_VALIDATION_SCRIPT,
  VALIDATION_TYPE_ERROR,
  VALIDATION_TYPE_WARNING,
  KEY_VALIDATION_APPLY_IN_LAYOUT
} from '../../../../constants/validation_constants';
import { INVOICE_UPDATE_ERROR } from '../constants/invoice_constant';

const updateError = (data_error, error_detail, warning_list) => dispatch => {
  return dispatch({
    type: INVOICE_UPDATE_ERROR,
    error_detail: error_detail,
    error_record: data_error,
    warning_list: warning_list
  });
};

const checkWarning = data_error => {
  let error_detail = null;
  let warning_list = [];
  for (let section in data_error) {
    let section_error = data_error[section];
    for (let key_index in section_error) {
      let section_item = section_error[key_index];
      for (let field in section_item) {
        let error = section_item[field] || [];
        let warning_detail = [];
        for (let error_index in error) {
          let element = error[error_index] || {};
          if (!error_detail && element.type === VALIDATION_TYPE_ERROR) {
            error_detail = {
              section_error: section,
              section_index: parseInt(key_index, 10),
              field_name: field,
              message: element.message
            };
          }
          if (element.type === VALIDATION_TYPE_WARNING) {
            warning_detail.push(element.message);
          }
        }
        if (warning_detail.length > 0) {
          warning_list.push({
            section_name: section,
            section_index: key_index,
            field_name: field,
            warning_detail: warning_detail
          });
        }
      }
    }
  }
  return {
    error_detail,
    warning_list
  };
};

const checkWarningOnField = error_data => {
  let error_field_focus = false;
  let warning_field_focus = [];
  for (let key in error_data) {
    let element = error_data[key];
    if (element.type === VALIDATION_TYPE_WARNING) {
      warning_field_focus.push(element.message);
    }
    if (element.type === VALIDATION_TYPE_ERROR) {
      error_field_focus = true;
    }
  }
  return {
    error_field_focus,
    warning_field_focus
  };
};

const checkPatternAndValidation = (field_item, field_value, data_item) => {
  let error_value = null;
  const validation = field_item[KEY_VALIDATION];
  const pattern = field_item[KEY_PATTERN];
  if (pattern[KEY_PATTERN_CONTENT]) {
    const message = handleTestPattern(pattern, field_value.text);
    if (message) {
      error_value = [
        {
          type: VALIDATION_TYPE_ERROR,
          message: message
        }
      ];
    }
  }
  if (!error_value && validation[KEY_VALIDATION_SCRIPT]) {
    error_value = handleTestValidation(
      field_value.text,
      data_item,
      validation[KEY_VALIDATION_SCRIPT] || '',
      validation[KEY_VALIDATION_ARGUMENTS] || {},
      validation[KEY_VALIDATION_APPLY_IN_LAYOUT]
    );
  }
  return error_value;
};

const checkValidationField = (
  record_focused,
  index_item_focused,
  field_name
) => (dispatch, getState) => {
  const fields = [
    ...getState().production.keying_invoice.section_definitions.fields
  ];
  let field_item = fields.filter(_f => _f.name === field_name)[0] || {};
  const section_name = field_item.section_name;
  const document_data = clone(
    getState().production.keying_invoice.invoice_document.document_data
  );
  let data_error = clone(
    getState().production.keying_invoice.invoice_error.error_record
  );
  ////////DATA DOCUMENT/////////////////////////////
  const data_record = clone(document_data[record_focused]) || {};
  const data_section = clone(data_record[section_name]) || [{}];
  const data_item = clone(data_section[index_item_focused]) || {};
  const field_value = data_item[field_name];
  ////////DATA ERROR////////////////////////////////
  let data_error_section = clone(data_error[section_name]) || [];
  let data_error_item = clone(data_error_section[index_item_focused]) || {};
  let error_value = [{}];
  if (field_value) {
    error_value = checkPatternAndValidation(
      field_item,
      field_value,
      field_item[KEY_VALIDATION][KEY_VALIDATION_APPLY_IN_LAYOUT]
        ? data_record
        : data_item
    ) || [{}];
    data_error_item[field_name] = error_value;
  }
  data_error_section[index_item_focused] = data_error_item;
  data_error[section_name] = data_error_section;
  let { error_detail, warning_list } = checkWarning(data_error);
  let { error_field_focus, warning_field_focus } = checkWarningOnField(
    error_value
  );

  dispatch(updateError(data_error, error_detail, warning_list));
  return { error_detail, warning_field_focus, error_field_focus };
};

const checkError = (
  document_data,
  error_record,
  warning_list,
  record_focused,
  field_focused
) => (dispatch, getState) => {
  const fields = clone(
    getState().production.keying_invoice.section_definitions.fields
  );
  let data_record = document_data[record_focused]; //object
  for (let section in data_record) {
    let data_section = clone(data_record[section]); //array

    for (let item_index in data_section) {
      let data_item = data_section[item_index]; //object

      for (let field_name in data_item) {
        let field_value = data_item[field_name];
        if (field_focused !== field_name && field_value.text.length > 0) {
          continue;
        }
        let field_item = fields.filter(_f => _f.name === field_name)[0] || {};
        let error_value = checkPatternAndValidation(
          field_item,
          field_value,
          data_item
        );
        if (!error_value) {
          continue;
        }
        let { error_field_focus, warning_field_focus } = checkWarningOnField(
          error_value
        );
        if (error_field_focus) {
          let error_section = clone(error_record[section]);
          let error_item = clone(error_section[item_index]);
          error_item[field_name] = error_value;
          error_section[item_index] = error_item;
          error_record[section] = error_section;
          dispatch(
            updateError(
              error_record,
              {
                field_name: field_name,
                message: '',
                section_error: section,
                section_index: item_index
              },
              warning_list
            )
          );
          dispatch(onFocusField(field_name, item_index));
          return true;
        }
        if (
          warning_field_focus.length > 0 &&
          findIndex(warning_list, _w => _w.field_name === field_name) === -1
        ) {
          warning_list.push({
            field_name: field_name,
            section_index: item_index,
            section_name: section,
            warning_detail: warning_field_focus
          });
        }
      }
    }
  }
  dispatch(updateError(error_record, null, warning_list));
  return false;
};

export { checkValidationField, checkError };
