import {
  VERIFY_KEY_MODIFY_FINAL_DATA,
  VERIFY_KEY_SET_FOCUS_FIELD,
  VERIFY_KEY_SET_FOCUS_RECORD,
  VERIFY_KEY_UPDATE_ERROR_DOCUMENT
} from '../constants/verify_key_contants';

import { checkValidation } from './verify_key_utilizing';
import _ from 'lodash';

export const onSelectRecord = (index: number) => (
  dispatch: any,
  getState: any
) => {
  const records = getState().production.verify_key.verify_key.data_document;
  const fields = getState().production.verify_key.field_definitions.data;
  let record = _.omit(records[index], 'keyer');
  const field_name = _.findKey(record, _r => _r.different === 1);
  const field_item = _.filter(fields, _.matches({ name: field_name }))[0] || {};
  return dispatch({
    type: VERIFY_KEY_SET_FOCUS_RECORD,
    focus_record: index,
    focus_field_name: field_name,
    positions: field_item.position || {}
  });
};

export const onFocusField = (field_name: string) => (
  dispatch: any,
  getState: any
) => {
  let {
    focus_field_name,
    is_render
  } = getState().production.verify_key.verify_key;
  if (focus_field_name === field_name) {
    return;
  }

  const fields = getState().production.verify_key.field_definitions.data;
  const field_item = _.filter(fields, _.matches({ name: field_name }))[0] || {};
  return dispatch({
    type: VERIFY_KEY_SET_FOCUS_FIELD,
    focus_field_name: field_name,
    positions: field_item.position || {},
    is_render: !is_render
  });
};

export const onBlurField = index => (dispatch: any, getState) => {
  const {
    positions,
    is_render,
    focus_record,
    focus_field_name,
    data_final
  } = getState().production.verify_key.verify_key;

  let error_document = [
    ...getState().production.verify_key.verify_key.error_document
  ];
  error_document = dispatch(
    checkValidation(
      data_final[focus_record],
      focus_record,
      focus_field_name,
      error_document
    )
  );
  dispatch({
    type: VERIFY_KEY_UPDATE_ERROR_DOCUMENT,
    error_document: error_document
  });
  return dispatch({
    type: VERIFY_KEY_SET_FOCUS_FIELD,
    focus_field_name: '',
    is_render: is_render,
    positions: positions
  });
};

export const onKeyDownSelectValue = (name: string) => (
  dispatch: any,
  getState: any
) => {
  const data_document = [
    ...getState().production.verify_key.verify_key.data_document
  ];
  const {
    focus_record,
    focus_field_name
  } = getState().production.verify_key.verify_key;
  if (focus_record === -1 || !focus_field_name) {
    return;
  }
  const data_record = { ...data_document[focus_record] };
  const field_value = data_record[focus_field_name][name] || '';
  return dispatch(
    onModifyFieldValue(focus_record, focus_field_name, field_value)
  );
};

export const onModifyFieldValue = (
  record_index: number,
  field_name: string,
  value: any,
  is_focus_out: boolean
) => (dispatch: any, getState: any) => {
  const records = [...getState().production.verify_key.verify_key.data_final];
  let current_record = { ...records[record_index] };
  if (current_record[field_name] === value || is_focus_out) {
    return;
  }
  current_record[field_name] = value;
  let total_different = -2;
  for (let key in current_record) {
    if (current_record.hasOwnProperty(key)) {
      let element = current_record[key];
      if (element !== null) {
        total_different++;
      }
    }
  }
  current_record.total_different = total_different;
  records[record_index] = current_record;
  return dispatch({
    type: VERIFY_KEY_MODIFY_FINAL_DATA,
    data_final: records
  });
};

const handleCheckValidation = (
  record_final,
  focus_record,
  field_name,
  error_document
) => dispatch => {
  error_document = dispatch(
    checkValidation(record_final, focus_record, field_name, error_document)
  );
  dispatch({
    type: VERIFY_KEY_UPDATE_ERROR_DOCUMENT,
    error_document: error_document
  });
};

export const onKeyPressFocus = (field_name, keyword) => (
  dispatch: any,
  getState: any
) => {
  let error_document = getState().production.verify_key.verify_key
    .error_document;

  const focus_record = getState().production.verify_key.verify_key.focus_record;
  const record_final = getState().production.verify_key.verify_key.data_final;
  switch (keyword) {
    case 'down':
    case 'next':
      dispatch(
        handleCheckValidation(
          record_final[focus_record],
          focus_record,
          field_name,
          [...error_document]
        )
      );
      return dispatch(focusNextField(record_final, focus_record, field_name));
    case 'up':
      dispatch(
        handleCheckValidation(
          record_final[focus_record],
          focus_record,
          field_name,
          [...error_document]
        )
      );
      return dispatch(focusPrevField(record_final, focus_record, field_name));
    default:
      break;
  }
};

const focusNextField = (record_final, focus_record, focus_field_name) => (
  dispatch: any,
  getState: any
) => {
  const records = getState().production.verify_key.verify_key.data_document;
  const record = Object.keys(
    _.pickBy(records[focus_record], _data => _data.different === 1)
  );
  const current_index = record.indexOf(focus_field_name);
  const field_name =
    current_index === record.length - 1 ? record[0] : record[current_index + 1];

  const field_value = record_final[focus_record][focus_field_name] || '';
  dispatch(onModifyFieldValue(focus_record, focus_field_name, field_value));

  return dispatch(onFocusField(field_name));
};

const focusPrevField = (
  record_final,
  focus_record,
  focus_field_name: string
) => (dispatch: any, getState: any) => {
  const records = getState().production.verify_key.verify_key.data_document;
  const record = Object.keys(
    _.pickBy(records[focus_record], _data => _data.different === 1)
  );
  const current_index = record.indexOf(focus_field_name);
  const field_name =
    current_index === 0 ? record[record.length - 1] : record[current_index - 1];

  const field_value = record_final[focus_record][focus_field_name] || '';
  dispatch(onModifyFieldValue(focus_record, focus_field_name, field_value));

  return dispatch(onFocusField(field_name));
};

export const focusUnVerifyField = (index_record: number) => (
  dispatch: any,
  getState: any
) => {
  const record_final = getState().production.verify_key.verify_key.data_final;
  const fields = getState().production.verify_key.field_definitions.data;
  let field_name = _.findKey(record_final[index_record], _r => _r === null);

  const field_item = _.filter(fields, _.matches({ name: field_name }))[0] || {};
  return dispatch({
    type: VERIFY_KEY_SET_FOCUS_RECORD,
    focus_record: index_record,
    focus_field_name: field_name,
    positions: field_item.position || {}
  });
};
