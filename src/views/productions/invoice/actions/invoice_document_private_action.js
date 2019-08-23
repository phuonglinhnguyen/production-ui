import clone from "clone";

import { findIndex, pick } from "lodash";
import { onKeyPressFocus, onFocusField } from "./invoice_document_action";
import { parseDocumentDataToItem } from "./invoice_utility";
import { updatePositionImage } from "./invoice_image_action";
import { saveTempData } from "./invoice_local_storage_action";

import {
  INVOICE_UPDATE_DOCUMENT_DATA,
  INVOICE_UPDATE_FOCUS_DETAILS
} from "../constants/invoice_constant";
import {
  KEY_DOUBLE_TYPING,
  KEY_TEXT_FIELD_TYPE
} from "../../../../constants/field_constants";
import { handleFormatFieldValue } from "../../../../utils/fields/field_preview_action";
const updateFocusField = (
  record_focused,
  section_focused,
  index_item,
  field_name
) => ({
  type: INVOICE_UPDATE_FOCUS_DETAILS,
  field_focused: field_name,
  index_item_focused: index_item,
  record_focused: record_focused,
  section_focused: section_focused
});

const updateDocumentData = document_data => ({
  type: INVOICE_UPDATE_DOCUMENT_DATA,
  document_data: document_data
});

const createDoubleTyping = (
  record_focused,
  section_focused,
  index_item,
  field_focused,
  value_double_typing,
  is_equal,
  type_format
) => (dispatch, getState) => {
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
    index_item,
    field_focused
  );
  value_double_typing = value_double_typing.trim();
  let {text} = field_value
  if (is_equal) {
    if (type_format) {
      text = handleFormatFieldValue(type_format, text);
    }
    field_value.text = text.trim();
    section_item[field_focused] = pick(field_value, [
      "text",
      "words",
      "original_value"
    ]);
  } else {
    section_item[field_focused] = {
      ...field_value,
      text: "",
      words: [],
      [KEY_DOUBLE_TYPING]: value_double_typing
    };
  }
  section_data[index_item] = section_item;
  record_data[section_focused] = section_data;
  document_data[record_focused] = record_data;
  dispatch(updateDocumentData(document_data));
  return;
};

const checkFinishDoubleTyping = (
  document_data,
  record_index,
  section_name,
  index_item,
  field_name
) => dispatch => {
  let {
    field_value,
    record_data,
    section_data,
    section_item
  } = parseDocumentDataToItem(
    document_data,
    record_index,
    section_name,
    index_item,
    field_name
  );
  if (!field_value.text) {
    return;
  }
  field_value.old_value = field_value.text;
  section_item[field_name] = field_value;
  section_data[index_item] = section_item;
  record_data[section_name] = section_data;
  document_data[record_index] = record_data;
  return dispatch(updateDocumentData(document_data));
};

const onKeyPressFocusMulti = (
  field_name,
  keycode,
  index_item_focused,
  section_fields = []
) => (dispatch, getState) => {
  const {
    document_data,
    record_focused,
    section_focused
  } = getState().production.keying_invoice.invoice_document;
  const record_data = document_data[record_focused];
  const section_data = record_data[section_focused];
  const sfield_index = findIndex(section_fields, _f => _f.name === field_name);
  const sfields_length = section_fields.length;
  switch (keycode) {
    /**
     * Change item
     */
    case "down":
      if (section_data.length - 1 === index_item_focused) {
        return dispatch(
          onKeyPressFocus(section_fields[sfields_length - 1].name, keycode)
        );
      } else {
        return dispatch(onFocusField(field_name, index_item_focused + 1));
      }
    case "up":
      if (index_item_focused === 0) {
        return dispatch(onKeyPressFocus(section_fields[0].name, keycode));
      } else {
        return dispatch(onFocusField(field_name, index_item_focused - 1));
      }
    /**
     * change field
     */
    case "right":
    case "next":
      if (sfield_index === sfields_length - 1) {
        if (index_item_focused === section_data.length - 1) {
          return dispatch(
            onKeyPressFocus(section_fields[sfields_length - 1].name, "down")
          );
        } else {
          if (section_fields[0].visible && !section_fields[0].disable) {
            return dispatch(
              onFocusField(section_fields[0].name, index_item_focused + 1)
            );
          } else {
            return dispatch(
              onKeyPressFocus(
                section_fields[0].name,
                "next",
                index_item_focused + 1,
                section_fields
              )
            );
          }
        }
      } else {
        if (
          section_fields[sfield_index + 1].visible &&
          !section_fields[sfield_index + 1].disable
        ) {
          return dispatch(
            onFocusField(
              section_fields[sfield_index + 1].name,
              index_item_focused
            )
          );
        } else {
          return dispatch(
            onKeyPressFocus(
              section_fields[sfield_index + 1].name,
              "next",
              index_item_focused,
              section_fields
            )
          );
        }
      }
    case "left":
      if (sfield_index === 0) {
        if (index_item_focused === 0) {
          return dispatch(onKeyPressFocus(section_fields[0].name, "up"));
        } else {
          if (
            section_fields[sfields_length - 1].visible &&
            !section_fields[sfields_length - 1].disable
          ) {
            return dispatch(
              onFocusField(
                section_fields[sfields_length - 1].name,
                index_item_focused - 1
              )
            );
          } else {
            return dispatch(
              onKeyPressFocus(
                section_fields[sfields_length - 1].name,
                "up",
                0,
                section_fields
              )
            );
          }
        }
      } else {
        if (
          section_fields[sfield_index - 1].visible &&
          !section_fields[sfield_index - 1].disable
        ) {
          return dispatch(
            onFocusField(
              section_fields[sfield_index - 1].name,
              index_item_focused
            )
          );
        } else {
          return dispatch(
            onKeyPressFocus(
              section_fields[sfield_index - 1].name,
              "left",
              index_item_focused,
              section_fields
            )
          );
        }
      }
    default:
      break;
  }
};

const updateFormatFieldValue = (
  document_data,
  record_focused,
  index_item_focused,
  field_item,
  field_value
) => (dispatch, getState) => {
  let clone_doc = clone(document_data);
  let { record_data, section_data, section_item } = parseDocumentDataToItem(
    clone(clone_doc),
    record_focused,
    field_item.section_name,
    index_item_focused,
    field_item.name
  );

  let new_value = field_value.text.trim();
  if (field_item[KEY_TEXT_FIELD_TYPE]) {
    new_value = handleFormatFieldValue(
      field_item[KEY_TEXT_FIELD_TYPE],
      new_value
    );
  }
  field_value.text = new_value;
  section_item[field_item.name] = field_value;
  section_data[index_item_focused] = section_item;
  record_data[field_item.section_name] = section_data;
  clone_doc[record_focused] = record_data;
  return dispatch(updateDocumentData(clone_doc));
};

const actionFocus = (
  record_index,
  section_name,
  index_item,
  field_name,
  field_value,
  field_item,
  double_typing_next_field,
  is_first_time,
  is_qc
) => (dispatch, getState) => {
  let {
    document_data,
    field_focused,
    index_item_focused,
    record_focused,
    section_focused
  } = getState().production.keying_invoice.invoice_document;
  let { text = "", old_value = "", double_typing = "" /**, original_value = ""*/} = field_value;
  text = text.trim();
  old_value = old_value.trim();
  double_typing = double_typing.trim();
  // original_value = original_value.trim()
  if(is_qc && old_value !== text){

  }
  if (!is_qc && field_item[KEY_DOUBLE_TYPING] && old_value !== text) {
    dispatch(
      createDoubleTyping(
        record_focused,
        section_focused,
        index_item_focused,
        field_focused,
        !double_typing ? text : "",
        !text || double_typing === text,
        field_item[KEY_TEXT_FIELD_TYPE]
      )
    );
    if (double_typing !== text) {
      return;
    }
  }
  if (text) {
    dispatch(
      updateFormatFieldValue(
        document_data,
        record_focused,
        index_item_focused,
        field_item,
        field_value
      )
    );
  }
  dispatch(
    updatePositionImage(record_index, section_name, index_item, field_name)
  );
  if (double_typing_next_field) {
    dispatch(
      checkFinishDoubleTyping(
        document_data,
        record_index,
        section_name,
        index_item,
        field_name
      )
    );
  }
  dispatch(
    updateFocusField(record_index, section_name, index_item, field_name)
  );
  if (is_first_time) {
    return;
  }
  return dispatch(saveTempData());
};

const removeWordInFieldValue = (field_value, new_value) => {
  let new_text_arr = new_value.text;
  let words = new_value.words;
  let final_words = [];
  for (let word_index in words) {
    if (words.hasOwnProperty(word_index)) {
      let word = words[word_index];
      if (new_text_arr.indexOf(word.text) !== -1) {
        final_words.push(word);
      }
    }
  }
  return {
    ...field_value,
    text: new_value.text,
    words: final_words
  };
};

const clearTextFieldFocus = () => (dispatch, getState) => {
  let {
    document_data,
    field_focused,
    index_item_focused,
    record_focused,
    section_focused
  } = getState().production.keying_invoice.invoice_document;
  let clone_doc = clone(document_data);
  let {
    record_data,
    section_data,
    section_item,
    field_value
  } = parseDocumentDataToItem(
    clone(clone_doc),
    record_focused,
    section_focused,
    index_item_focused,
    field_focused
  );
  field_value.text = "";
  field_value.words = [];
  section_item[field_focused] = field_value;
  section_data[index_item_focused] = section_item;
  record_data[section_focused] = section_data;
  clone_doc[record_focused] = record_data;
  return dispatch(updateDocumentData(clone_doc));
};

export {
  actionFocus,
  clearTextFieldFocus,
  onKeyPressFocusMulti,
  updateDocumentData,
  removeWordInFieldValue,
  updateFocusField
};
