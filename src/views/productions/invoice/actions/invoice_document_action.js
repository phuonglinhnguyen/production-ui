import {
  actionFocus,
  clearTextFieldFocus,
  onKeyPressFocusMulti,
  removeWordInFieldValue,
  updateDocumentData,
  updateFocusField
} from "./invoice_document_private_action";
import { checkValidationField } from "./invoice_validate";
import { getNextFieldSingle, parseDocumentDataToItem } from "./invoice_utility";
import { openWarningList } from "./invoice_task_action";
import { updatePositionImage } from "./invoice_image_action";

import {
  INVOICE_CHANGE_TEXTAREA_MODE,
  INVOICE_UPDATE_ERROR,
  KEY_ACTION_PROOF,
  KEY_ACTION_QC
} from "../constants/invoice_constant";
import {
  KEY_DOUBLE_TYPING,
  KEY_CONTROL_TYPE
} from "../../../../constants/field_constants";
import { COMPONENT_COMBOBOX } from "../../../../constants";

import { differenceBy } from "lodash";

import clone from "clone";

const onModifyFieldValue = (value, is_plus, field_name) => (
  dispatch,
  getState
) => {
  let {
    field_focused,
    index_item_focused,
    record_focused,
    section_focused
  } = getState().production.keying_invoice.invoice_document;
  if (!field_focused) {
    return;
  }
  if (field_name) {
    field_focused = field_name;
  }
  let document_data = clone(
    getState().production.keying_invoice.invoice_document.document_data
  );
  let {
    field_value,
    record_data,
    section_data,
    section_item
  } = parseDocumentDataToItem(
    document_data,
    record_focused,
    section_focused,
    index_item_focused,
    field_focused
  );
  let fields = getState().production.keying_invoice.section_definitions.fields;
  const field_item = fields.filter(_f => _f.name === field_focused)[0];
  if (is_plus) {
    if (field_item[KEY_CONTROL_TYPE] === COMPONENT_COMBOBOX) {
      return;
    }
    field_value.text = `${field_value.text}${value.text} `;
    if (Array.isArray(value.word)) {
      field_value.words = field_value.words.concat(
        differenceBy(value.word, field_value.words, "id")
      );
    } else if (typeof value.word === "object") {
      field_value.words.push(value.word);
    }
    section_item[field_focused] = field_value;
  } else {
    const old_length = field_value.text.length;
    const new_length = value.text.length;
    if (field_value[KEY_DOUBLE_TYPING] && new_length - old_length > 1) {
      value.text = field_value.text + " ";
    }
    if (old_length < value.text.length) {
      section_item[field_focused] = {
        ...field_value,
        ...value
      };
    } else {
      section_item[field_focused] = removeWordInFieldValue(field_value, value);
    }
  }
  section_data[index_item_focused] = section_item;
  record_data[section_focused] = section_data;
  document_data[record_focused] = record_data;
  dispatch(updateDocumentData(document_data));
  return dispatch(
    updatePositionImage(
      record_focused,
      section_focused,
      index_item_focused,
      field_focused
    )
  );
};

const onFocusField = (field_name, index_item, click_focus) => (
  dispatch,
  getState
) => {
  let {
    action_type,
    document_data,
    field_focused,
    index_item_focused,
    record_focused,
    section_focused
  } = getState().production.keying_invoice.invoice_document;
  if (
    click_focus &&
    field_focused === field_name &&
    index_item_focused === index_item
  ) {
    return;
  }
  let { warning_field_focus, error_field_focus } = dispatch(
    checkValidationField(record_focused, index_item_focused, field_focused)
  );
  if (error_field_focus) {
    return dispatch(
      updateFocusField(
        record_focused,
        section_focused,
        index_item_focused,
        field_focused
      )
    );
  }

  const fields = [
    ...getState().production.keying_invoice.section_definitions.fields
  ];
  let field_item = fields.filter(_f => _f.name === field_name)[0] || {};
  let section_name = field_item.section_name;

  let { field_value } = parseDocumentDataToItem(
    clone(document_data),
    record_focused,
    section_focused,
    index_item_focused,
    field_focused
  );
  let field_item_focused =
    fields.filter(_f => _f.name === field_focused)[0] || {};
  let value_double_typing = field_value[KEY_DOUBLE_TYPING];
  if (warning_field_focus.length > 0 && !value_double_typing) {
    return dispatch(
      openWarningList(warning_field_focus, () =>
        dispatch(
          actionFocus(
            record_focused,
            section_name,
            index_item,
            field_name,
            field_value,
            field_item_focused,
            field_item[KEY_DOUBLE_TYPING],
            false,
            action_type === KEY_ACTION_QC
          )
        )
      )
    );
  }
  return dispatch(
    actionFocus(
      record_focused,
      section_name,
      index_item,
      field_name,
      field_value,
      field_item_focused,
      field_item[KEY_DOUBLE_TYPING],
      false,
      action_type === KEY_ACTION_QC
    )
  );
};

const onKeyPressFocus = (
  field_name,
  keycode,
  index_item_focused,
  section_fields
) => (dispatch, getState) => {
  if (section_fields) {
    return dispatch(
      onKeyPressFocusMulti(
        field_name,
        keycode,
        index_item_focused,
        section_fields
      )
    );
  }
  const fields = getState().production.keying_invoice.section_definitions
    .fields;

  let field_next = getNextFieldSingle(
    field_name,
    fields,
    ["up", "left"].indexOf(keycode) === -1
  );
  if (field_next) {
    if (field_next.is_multiple) {
      if (["up", "left"].indexOf(keycode) === -1) {
        return dispatch(onFocusField(field_next.name, 0));
      } else {
        const {
          document_data,
          record_focused
        } = getState().production.keying_invoice.invoice_document;

        const record_data = document_data[record_focused];
        const section_data = record_data[field_next.section_name];
        return dispatch(onFocusField(field_next.name, section_data.length - 1));
      }
    } else {
      return dispatch(onFocusField(field_next.name, 0));
    }
  }
};

const addOrRemoveSectionItem = (is_add, action) => (dispatch, getState) => {
  let {
    document_data,
    field_focused,
    record_focused,
    section_focused,
    index_item_focused
  } = getState().production.keying_invoice.invoice_document;
  if (action === KEY_ACTION_QC) {
    return;
  }
  let error_record = clone(
    getState().production.keying_invoice.invoice_error.error_record
  );
  let clone_data_doc = clone(document_data);
  let record_data = clone_data_doc[record_focused];

  let section_data = record_data[section_focused];
  let error_section = clone(error_record[section_focused]);

  let clone_item = clone(section_data[0]);
  let error_item = clone(error_section[0]);
  for (let key in clone_item) {
    if (clone_item.hasOwnProperty(key)) {
      error_item[key] = [{ type: "", message: "" }];
      clone_item[key] = { text: "", words: [] };
      if (action === KEY_ACTION_PROOF) {
        clone_item[key].original_value = "";
      }
    }
  }
  if (is_add) {
    section_data.splice(index_item_focused + 1, 0, clone_item);
    error_section.splice(index_item_focused + 1, 0, error_item);
  } else {
    if (section_data.length === 1) {
      section_data.splice(0, 1, clone_item);
      error_section.splice(0, 1, error_item);
    } else {
      error_section.splice(index_item_focused, 1);
      section_data.splice(index_item_focused, 1);
      if (section_data.length === index_item_focused) {
        dispatch(onFocusField(field_focused, index_item_focused - 1));
      }
    }
  }
  record_data[section_focused] = section_data;
  error_record[section_focused] = error_section;

  clone_data_doc[record_focused] = record_data;

  dispatch({
    type: INVOICE_UPDATE_ERROR,
    error_record: error_record
  });
  return dispatch(updateDocumentData(clone_data_doc));
};

const changeFieldMode = (textarea_mode, anchorEl) => dispatch => {
  return dispatch({
    type: INVOICE_CHANGE_TEXTAREA_MODE,
    textarea_mode: textarea_mode,
    anchor: anchorEl
  });
};

const clearText = is_all => (dispatch, getState) => {
  let document_data = clone(
    getState().production.keying_invoice.invoice_document.document_data
  );
  if (!is_all) {
    return dispatch(clearTextFieldFocus());
  }
  for (const record_index in document_data) {
    let record_data = document_data[record_index];
    for (const section_name in record_data) {
      let section_data = record_data[section_name];
      for (const section_index in section_data) {
        let section_item = section_data[section_index];
        for (const field_name in section_item) {
          let field_value = section_item[field_name];
          field_value.text = "";
          field_value.words = [];
          section_item[field_name] = field_value;
        }
        section_data[section_index] = section_item;
      }
      record_data[section_name] = section_data;
    }
    document_data[record_index] = record_data;
  }
  return dispatch(updateDocumentData(document_data));
};

export {
  addOrRemoveSectionItem,
  changeFieldMode,
  clearText,
  onFocusField,
  onKeyPressFocus,
  onModifyFieldValue
};
