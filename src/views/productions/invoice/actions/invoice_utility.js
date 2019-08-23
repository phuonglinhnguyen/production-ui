import { findIndex, pick } from 'lodash';
import clone from 'clone';

import { handleTestValidation } from '../../../../utils/fields/field_preview_action';

import {
  KEY_VALIDATION,
  KEY_PATTERN,
  KEY_RULE_TRANSFORM,
  KEY_DOUBLE_TYPING,
  KEY_TEXT_FIELD_TYPE,
  KEY_CONTROL_TYPE
} from '../../../../constants/field_constants';
import {
  KEY_TRANSFORM_RULE_SCRIPT,
  KEY_TRANSFORM_RULE_ARGUMENTS
} from '../../../../constants/transform_rule_constants';

import {
  KEY_COMMENT,
  KEY_COMPLETE_OPTION,
  KEY_HOLD_COUNT,
  KEY_KEYING_DATA,
  KEY_FORM_URI
} from '../constants/invoice_constant';

/**
 * TASK UTILITY
 */
const getDocInfoFromTaskData = variables => {
  let docInfo = variables.filter(_v => _v.name === 'input_data')[0] || {};
  let completeOption =
    variables.filter(_v => _v.name === KEY_COMPLETE_OPTION)[0] || {};
  let comment = variables.filter(_v => _v.name === KEY_COMMENT)[0] || {};
  let holdCount = variables.filter(_v => _v.name === KEY_HOLD_COUNT)[0] || {};
  let keyData = variables.filter(_v => _v.name === KEY_KEYING_DATA)[0] || {};
  let formUri = variables.filter(_v => _v.name === KEY_FORM_URI)[0] || {};
  return {
    formUri: formUri.value,
    docInfo: docInfo.value,
    completeOption: completeOption.value,
    comment: comment.value || '',
    holdCount: holdCount.value ? parseInt(holdCount.value, 10) : 0,
    keyData: keyData.value
  };
};

const createDataDocument = (sections = []) => {
  let data_record = {};
  let error_record = {};
  for (let index_section in sections) {
    if (sections.hasOwnProperty(index_section)) {
      let section_item = sections[index_section];
      let fields = section_item.fields;
      let data_field = {};
      let error_field = {};
      for (let index_field in fields) {
        if (fields.hasOwnProperty(index_field)) {
          let field = fields[index_field];
          let item = {
            text: '',
            words: []
          };
          data_field[field.name] = item;
          error_field[field.name] = [{ type: '', message: '' }];
        }
      }
      data_record[section_item.name] = [data_field];
      error_record[section_item.name] = [error_field];
    }
  }
  return { document_data: [data_record], error_record: error_record };
};

const mergeDataDocument = (sectionName = [], keyData = [], action) => {
  let document_data = [];
  let error_record = {};
  let key_data = keyData.records ? keyData.records : keyData;
  for (let record_index in key_data) {
    let record_key_data = key_data[record_index].keyed_data;
    let record_data = {};
    for (let section_index in sectionName) {
      let section_name = sectionName[section_index];
      let section_item = record_key_data.filter(
        _s => _s.section === section_name
      )[0];
      if (section_item && section_item.data) {
        let error_section = [];
        for (let section_index in section_item.data) {
          let section_data = section_item.data[section_index];
          let error_item = {};
          for (let field_name in section_data) {
            if (action) {
              section_data[field_name].original_value =
                section_data[field_name].text;
            }
            error_item[field_name] = [{ type: '', message: '' }];
          }
          error_section.push(error_item);
        }
        if (parseInt(record_index, 10) === 0) {
          error_record[section_name] = error_section;
        }
        record_data[section_name] = section_item.data;
      }
    }
    document_data.push(record_data);
  }
  return { document_data: document_data, error_record: error_record };
};

const getFieldsBySections = (sections, is_keying) => {
  let fields = [];
  let section_name = {};
  for (let index_section in sections) {
    if (sections.hasOwnProperty(index_section)) {
      let section = sections[index_section];
      section_name[section.name] = 1;
      const field_item = section.fields;
      for (let index_field in field_item) {
        if (field_item.hasOwnProperty(index_field)) {
          let field = field_item[index_field];
          fields = [
            ...fields,
            {
              is_multiple: section.is_multiple,
              name: field.name,
              section_name: section.name,
              visible: field.visible,
              disable: field.disable,
              [KEY_DOUBLE_TYPING]: field[KEY_DOUBLE_TYPING],
              [KEY_PATTERN]: field[KEY_PATTERN],
              [KEY_RULE_TRANSFORM]: field[KEY_RULE_TRANSFORM],
              [KEY_VALIDATION]: field[KEY_VALIDATION],
              [KEY_TEXT_FIELD_TYPE]: field[KEY_TEXT_FIELD_TYPE],
              [KEY_CONTROL_TYPE]: field[KEY_CONTROL_TYPE]
            }
          ];
        }
      }
    }
  }
  return { fields, section_name: Object.keys(section_name) };
};

const getNextFieldSingle = (field_name, fields, is_next) => {
  const index = findIndex(fields, _f => _f.name === field_name);

  let field_name_next;
  if (is_next) {
    if (index === fields.length - 1) {
      field_name_next = fields[0];
    } else {
      field_name_next = fields[index + 1];
    }
  } else {
    if (index === 0) {
      field_name_next = fields[fields.length - 1];
    } else {
      field_name_next = fields[index - 1];
    }
  }
  if (!field_name_next.visible || field_name_next.disable) {
    return getNextFieldSingle(field_name_next.name, fields, is_next);
  }
  return field_name_next;
};

const transformRuleForField = (value, field_item = {}, section_data) => {
  let rule_transform = field_item[KEY_RULE_TRANSFORM] || {};
  let script = rule_transform[KEY_TRANSFORM_RULE_SCRIPT];
  if (!script) {
    return value;
  }
  try {
    let transform_argument = rule_transform[KEY_TRANSFORM_RULE_ARGUMENTS];
    let transform_value = handleTestValidation(
      value,
      section_data,
      script,
      transform_argument
    );
    return transform_value;
  } catch (error) {
    return value;
  }
};

const transformRule = (section_data, fields) => {
  let transform_data = [];

  for (let item_index in section_data) {
    let item_data = section_data[item_index];
    let transform_item = {};
    for (let field_name in item_data) {
      let field_value = item_data[field_name] || { text: '' };
      field_value.text = field_value.text.trim();
      let transform_value = transformRuleForField(
        field_value.text,
        fields.filter(_f => _f.name === field_name)[0] || {}
      );
      field_value = pick(field_value, ['text', 'words']);
      transform_item[field_name] = { ...field_value, text: transform_value };
    }
    transform_data.push(transform_item);
  }
  return transform_data;
};

const createDataToSave = (document_data, information, fields = [], reason) => {
  let database_data = {};
  let workflow_data = [];
  for (let record_index in document_data) {
    let record_data = document_data[record_index] || {};
    let database_record = [];
    let workflow_record = [];
    for (let section_name in record_data) {
      let section_data = record_data[section_name];
      let transform_data = transformRule(
        section_data,
        fields.filter(_f => _f.section_name === section_name)
      );
      database_record.push({
        ...information,
        reason: reason ? reason.value : null,
        source: null,
        section: section_name,
        data: section_data
      });
      database_record.push({
        ...information,
        reason: reason ? reason.value : null,
        source: 'queue_transform',
        section: section_name,
        data: transform_data
      });
      workflow_record.push({
        section: section_name,
        data: transform_data
      });
    }
    database_data[`records.${record_index}.keyed_data`] = database_record;
    workflow_data.push({
      keyed_data: workflow_record
    });
  }
  return { database_data, workflow_data };
};

const parseDocumentDataToItem = (
  document_data,
  record_index,
  section_name,
  section_index,
  field_name
) => {
  let record_data = clone(document_data[record_index]);
  let section_data = clone(record_data[section_name]);
  let section_item = clone(section_data[section_index]);
  let field_value = clone(section_item[field_name]);
  return {
    field_value,
    record_data,
    section_data,
    section_item
  };
};

export {
  createDataDocument,
  createDataToSave,
  getDocInfoFromTaskData,
  getFieldsBySections,
  getNextFieldSingle,
  mergeDataDocument,
  parseDocumentDataToItem
};
