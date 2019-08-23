import React from 'react';
import ReactDOM from 'react-dom';

import Subheader from 'material-ui/Subheader';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';

import {
  KEY_FIELD_DISPLAY,
  KEY_FIELD_NAME,
  KEY_DOUBLE_TYPING,
  KEY_CONTROL_TYPE
} from '../../../../../constants/field_constants';
import { COMPONENT_TEXTAREA } from '../../../../../constants';

import DoneIcon from 'material-ui/svg-icons/action/done';
import DoneAllIcon from 'material-ui/svg-icons/action/done-all';
import DoubleTypingIcon from 'material-ui/svg-icons/image/filter-2';

import { orange500, red500, lightBlue500 } from 'material-ui/styles/colors';
import clone from 'clone';

class KeyingInvoiceMulti extends React.Component {
  componentDidUpdate() {
    const focus_field_item = ReactDOM.findDOMNode(
      this.refs[`text_area_field_focus`]
    );
    if (focus_field_item && document.activeElement.type !== 'input') {
      focus_field_item.childNodes[1].childNodes[0].childNodes[1].childNodes[1].focus();
    }
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
      // Translate, use later
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      action_renderFieldFocus,
      anchor,
      data_section = [{}],
      error_section = [{ '': {} }],
      field_focused = '',
      index_item_focused,
      muiTheme,
      section = {},
      textarea_mode
    } = this.props;
    if (!textarea_mode || !anchor) {
      return null;
    }
    const {
      alternateTextColor,
      background4Color,
      primary1Color,
      textColor
    } = muiTheme.palette;

    const data_item = data_section[index_item_focused];

    const fields = section.fields;

    const error_field = error_section[index_item_focused][field_focused] || [
      {}
    ];

    const error_text = error_field[0].message || '';
    const error_type = error_field[0].type || '';
    const error_color =
      error_type === 'warning'
        ? orange500
        : error_type === 'error' ? red500 : null;
    let field_item = clone(fields.filter(_f => _f.name === field_focused)[0]);
    field_item[KEY_CONTROL_TYPE] = `${COMPONENT_TEXTAREA}`;
    const field_value = data_item[field_item[KEY_FIELD_NAME]];
    const { text, original_value } = field_value;
    let color_different = null;
    if (
      typeof original_value === 'string' &&
      original_value.trim() !== text.trim()
    ) {
      color_different = lightBlue500;
    }
    return (
      <Popover anchorEl={anchor} open={true} useLayerForClickAway={false}>
        <Paper
          style={{
            backgroundColor: background4Color,
            margin: 2,
            padding: 5,
            width: window.innerWidth / 4
          }}
          zDepth={2}
        >
          <Subheader style={{ color: color_different || textColor }}>
            {field_item[KEY_FIELD_DISPLAY]}
            {field_item[KEY_DOUBLE_TYPING] &&
              this.renderDoubleTyping(field_value)}
          </Subheader>
          {action_renderFieldFocus(
            action_onModifyFieldValue,
            action_onKeyPressFocus,
            action_onFocusField,
            data_item,
            {
              fields,
              field_item
            },
            {
              error_text: error_text,
              error_color: error_color
            },
            { primary1Color, alternateTextColor },
            index_item_focused,
            'text_area_field_focus'
          )}
        </Paper>
      </Popover>
    );
  }
}

export default KeyingInvoiceMulti;
