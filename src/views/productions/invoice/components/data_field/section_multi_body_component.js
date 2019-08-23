import React from 'react';
import ReactDOM from 'react-dom';

import { TableRow, TableRowColumn } from 'material-ui/Table';

import FieldInput from '../../../../../components/common/form/input_field';

import {
  KEY_FIELD_NAME,
  KEY_FIELD_DISPLAY
} from '../../../../../constants/field_constants';

import { isEqual } from 'lodash';

import { orange500, red500, lightBlue500 } from 'material-ui/styles/colors';

class KeyingMultiTextField extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode;
    const {
      action_addOrRemoveSectionItem,
      action_changeFieldMode
    } = this.props;
    if (keyCode === 113 && !this.props.is_empty_state) {
      event.preventDefault();
      const node = ReactDOM.findDOMNode(this.refs[`field-input`]);
      action_changeFieldMode(!this.props.textarea_mode, node);
    }
    if (!event.altKey || this.props.is_empty_state) {
      return;
    }
    if ([107, 187].indexOf(keyCode) !== -1) {
      action_addOrRemoveSectionItem(true);
    }
    if ([109, 189].indexOf(keyCode) !== -1) {
      action_addOrRemoveSectionItem(false);
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    let textarea_mode = this.props.textarea_mode;
    if (textarea_mode) {
      return;
    }
    const focus_field_item = ReactDOM.findDOMNode(this.refs[`field_focus`]);
    if (focus_field_item && document.activeElement.type !== 'input') {
      focus_field_item.childNodes[1].childNodes[0].childNodes[1].focus();
    }
  }

  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          key !== 'fields' &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const {
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      action_renderFieldFocus,
      data_item = {},
      error_section = {},
      field_focused,
      fields,
      item_index,
      muiTheme,
      // textarea_mode
    } = this.props;
    const { alternateTextColor, primary1Color } = muiTheme.palette;
    return (
      <TableRow>
        <TableRowColumn style={{ width: 20 }}>{item_index + 1}</TableRowColumn>
        {fields.map((_f, i) => {
          let error_field = error_section[_f.name] || [{}];
          let error_text = error_field[0].message || '';
          let error_type = error_field[0].type || '';
          let error_color =
            error_type === 'warning'
              ? orange500
              : error_type === 'error' ? red500 : null;
          let { text, words, original_value } = data_item[_f.name];
          let color_different = null;
          if (
            typeof original_value === 'string' &&
            original_value.trim() !== text.trim()
          ) {
            color_different = lightBlue500;
          }
          if (_f.name === field_focused) {
            return (
              <TableRowColumn
                key={`field-input`}
                ref={`field-input`}
                style={{
                  padding: 0,
                  width: 149
                }}
              >
                {action_renderFieldFocus(
                  action_onModifyFieldValue,
                  action_onKeyPressFocus,
                  action_onFocusField,
                  data_item,
                  { fields, field_item: _f },
                  { error_text, error_color },
                  { primary1Color, alternateTextColor },
                  item_index,
                  'field_focus'
                )}
              </TableRowColumn>
            );
          }
          return (
            <TableRowColumn
              onClick={e =>
                action_onFocusField(_f[KEY_FIELD_NAME], item_index)
              }
              key={`field-un-input-${i}`}
              style={{
                padding: 0,
                width: 149,
                borderLeft: color_different
                  ? `2px solid ${color_different}`
                  : null,
                display: _f.visible ? null : 'none'
              }}
            >
              <FieldInput
                changeField={(...params) => {
                  if (!params[0]) {
                    words = [];
                  }
                  action_onModifyFieldValue(
                    { text: params[0], words: words },
                    false,
                    _f[KEY_FIELD_NAME]
                  );
                }}
                readOnly={true}
                errorText={error_text}
                field={_f}
                floatingLabelText={''}
                name={_f[KEY_FIELD_NAME]}
                onFocus={event =>
                  action_onFocusField(_f[KEY_FIELD_NAME], item_index, true)
                }
                errorStyle={{
                  color: error_color
                }}
                value={text || ''}
                underlineShow={_f.disable}
              />
            </TableRowColumn>
          );
        })}
      </TableRow>
    );
  }
}

class KeyingMultiTableRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          key !== 'fields' &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const {
      action_onFocusField,
      data_item,
      // error_section = {},
      fields,
      item_index,
      muiTheme
    } = this.props;
    const { textColor, background3Color } = muiTheme.palette;
    return (
      <TableRow>
        <TableRowColumn
          key={`cell-index`}
          tooltip={`Row index`}
          style={{
            width: 20,
            color: textColor,
            borderRight: `1px ${background3Color} solid`
          }}
        >
          {item_index + 1}
        </TableRowColumn>
        {fields.map((_f, i) => {
          // if (!_f.visible) {
          //   return null;
          // }
          let { text = '', original_value } = data_item[_f.name];
          let color_different = null;
          if (
            typeof original_value === 'string' &&
            original_value.trim() !== text.trim()
          ) {
            color_different = lightBlue500;
          }
          return (
            <TableRowColumn
              key={`cell-${item_index}-${_f.name}`}
              style={{
                width: 100,
                borderRight: `1px ${background3Color} solid`,
                borderLeft: color_different
                  ? `2px solid ${color_different}`
                  : null,
                display: _f.visible ? null : 'none'
              }}
              tooltip={_f[KEY_FIELD_DISPLAY]}
              onClick={e => action_onFocusField(fields[i].name, item_index)}
            >
              {text &&
                text.split('').map((_t, i) => {
                  if (
                    typeof original_value === 'string' &&
                    _t !== original_value.split('')[i]
                  ) {
                    return (
                      <span key={`dif-${i}`} className="warning">
                        {_t}
                      </span>
                    );
                  }
                  return _t;
                })}
            </TableRowColumn>
          );
        })}
      </TableRow>
    );
  }
}

export { KeyingMultiTextField, KeyingMultiTableRow };
