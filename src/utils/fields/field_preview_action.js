import * as pattern_constants from '../../constants/pattern_constants'
import {
    // FIELD_PREVIEW_RECIEVED_DATA,
    // KEY_PATTERN,
    // KEY_VALIDATION,
    // KEY_RULE_TRANSFORM,
    // FIELD_PREVIEW_RESET_DATA,
    KEY_FIELD_TYPE_NUMERIC,
    // KEY_TEXT_FIELD_TYPE,
    KEY_FIELD_TYPE_DATE
  } from '../../constants/field_constants';
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
  export const handleTestPattern = (pattern: Object, value: string) => {
    if (new RegExp(pattern[pattern_constants.KEY_PATTERN_CONTENT]).test(value)) {
      return '';
    } else {
      return pattern[pattern_constants.KEY_PATTERN_DESCRIPTION];
    }
  };

  export const handleFormatFieldValue = (format_type, value) => {
    switch (format_type) {
      case KEY_FIELD_TYPE_NUMERIC:
        if (!value) {
          return '';
        }
        let arr = value.split('.');
        value = arr[0] + '.' + arr[1] || 0;
        value = parseFloat(value).toFixed(2);
        return value;
      case KEY_FIELD_TYPE_DATE:
        if (value.length === 6) {
          let current_year = new Date().getFullYear();
          let plus_year = 20 + value.slice(4, 6);
          if (parseInt(plus_year,0) > current_year) {
            plus_year = 19 + value.slice(4, 6);
          }
          value = value.slice(0, 4) + plus_year;
        }
        return value;
      default:
        break;
    }
  };
  