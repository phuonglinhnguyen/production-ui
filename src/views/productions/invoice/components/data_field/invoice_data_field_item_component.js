import React from 'react';
import ReactDOM from 'react-dom';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import scrollIntoView from 'scroll-into-view';
import FieldInput from '../../../../../components/common/form/input_field';

import {
  KEY_DOUBLE_TYPING,
  KEY_FIELD_DISPLAY,
  KEY_FIELD_NAME
} from '../../../../../constants/field_constants';

import { isEqual } from 'lodash';

import { orange500, red500, lightBlue500 } from 'material-ui/styles/colors';

import DoneAllIcon from 'material-ui/svg-icons/action/done-all';
import DoneIcon from 'material-ui/svg-icons/action/done';
import DoubleTypingIcon from 'material-ui/svg-icons/image/filter-2';

const scrollTo = {
  left: 0,
  leftOffset: 0,
  top: 0,
  topOffset: 144
};

class FieldItem extends React.Component {
  componentDidUpdate(prevProps) {
    const node = ReactDOM.findDOMNode(this.refs[`focus_ref_field`]);
    const focus_field_item = ReactDOM.findDOMNode(this.refs[`field_focus`]);
    if (focus_field_item && document.activeElement.type !== 'input') {
      focus_field_item.childNodes[1].childNodes[0].childNodes[1].focus();
    }
    if (node && prevProps.is_focus !== this.props.is_focus) {
      scrollIntoView(node, {
        time: 0,
        align: {
          left: scrollTo.left,
          leftOffset: scrollTo.leftOffset,
          top: scrollTo.top,
          topOffset: scrollTo.topOffset
        }
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          key !== 'field' &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  renderDoubleTyping(final_value) {
    const style = {
      viewBox: '0 -5 24 24',
      style: { marginLeft: 10 }
    };
    if (final_value.double_typing) {
      return <DoneIcon color={lightBlue500} {...style} />;
    }
    if (final_value.old_value) {
      return <DoneAllIcon color={lightBlue500} {...style} />;
    }
    return <DoubleTypingIcon color={red500} {...style} />;
  }

  render() {
    const {
      action_onBlurField,
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      error_field = [{}],
      field,
      final_value = { text: '' },
      is_disabled,
      is_focus,
      muiTheme
    } = this.props;
    const {
      alternateTextColor,
      background4Color,
      textColor
    } = muiTheme.palette;
    const double_typing = field[KEY_DOUBLE_TYPING];
    const error_type = error_field[0].type || '';
    const field_error = error_field[0].message || '';
    let { original_value, text = '', words } = final_value;
    let title_color = null;
    if (
      typeof original_value === 'string' &&
      original_value.trim() !== text.trim()
    ) {
      title_color = lightBlue500;
    }
    if (is_focus) {
      return (
        <Paper
          ref={'focus_ref_field'}
          style={{
            padding: 5,
            margin: 4,
            backgroundColor: background4Color,
            display : field.visible ? null : 'none'
          }}
          zDepth={2}
        >
          <Subheader style={{ color: title_color || textColor }}>
            {field[KEY_FIELD_DISPLAY]}
            {double_typing && this.renderDoubleTyping(final_value)}
          </Subheader>
          <FieldInput
            autoFocus={true}
            canAutoPosition={true}
            changeField={(...params) => {
              if (!params[0]) {
                words = [];
              }
              action_onModifyFieldValue(
                { text: params[0], words: words },
                false,
                field[KEY_FIELD_NAME]
              );
            }}
            errorText={field_error}
            disabled={is_disabled}
            field={field}
            floatingLabelText={''}
            name={field[KEY_FIELD_NAME]}
            nextFocus={(event, key_down) =>
              action_onKeyPressFocus(field[KEY_FIELD_NAME], key_down.goto, 0)
            }
            onBlur={() => action_onBlurField(field[KEY_FIELD_NAME])}
            onFocus={event =>
              action_onFocusField(field[KEY_FIELD_NAME], 0, true)
            }
            ref="field_focus"
            textFieldStyle={{
              width: '100%',
              backgroundColor: alternateTextColor
            }}
            value={text}
            errorStyle={{
              bottom: -3,
              color: error_type === 'warning' ? orange500 : red500
            }}
          />
        </Paper>
      );
    } else {
      return (
        <FieldInput
          changeField={(...params) => {
            if (!params[0]) {
              words = [];
            }
            action_onModifyFieldValue(
              { text: params[0], words: words },
              false,
              field[KEY_FIELD_NAME]
            );
          }}
          disabled={is_disabled}
          errorStyle={{
            color: error_type === 'warning' ? orange500 : red500
          }}
          errorText={field_error}
          field={field}
          floatingLabelFixed={true}
          floatingLabelText={field[KEY_FIELD_DISPLAY]}
          floatingLabelStyle={title_color ? { color: title_color } : {}}
          name={field[KEY_FIELD_NAME]}
          nextFocus={(event, key_down) => undefined}
          onFocus={() => action_onFocusField(field[KEY_FIELD_NAME], 0, true)}
          readOnly={true}
          textFieldStyle={{ marginLeft: 20, marginRight: 20, width: '93%' ,
            display : field.visible ? null : 'none'}}
          value={text}
        />
      );
    }
  }
}

export default FieldItem;
