import React from 'react';
import ReactDOM from 'react-dom';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import FieldInput from '../../../../components/common/form/input_field';

import * as field_constants from '../../../../constants/field_constants';

import ClickOutside from 'react-click-outside';
import _ from 'lodash';

class FieldItem extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.is_focus === this.props.is_focus) {
      return;
    }
    const node = ReactDOM.findDOMNode(this.refs[`focus_ref_field`]);
    if (node) {
      node.scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const {
      action_onBlurField,
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      field,
      field_error,
      field_value,
      final_value = '',
      is_disabled,
      is_focus,
      primary1Color,
      record_index = 0
    } = this.props;
    if (is_focus) {
      return (
        <ClickOutside
          onClickOutside={e => {
            if (e.target.tagName && e.target.tagName.toLowerCase() === 'td') {
              return;
            }
            action_onBlurField();
          }}
        >
          <Paper
            ref={'focus_ref_field'}
            style={{ padding: 5, margin: 4 }}
            zDepth={2}
          >
            <Subheader>{field[field_constants.KEY_FIELD_DISPLAY]}</Subheader>
            <div style={{ display: 'flex' }}>
              <Chip
                onClick={() =>
                  action_onModifyFieldValue(
                    record_index,
                    field[field_constants.KEY_FIELD_NAME],
                    field_value.value_1 || ''
                  )
                }
              >
                <Avatar size={32} backgroundColor={primary1Color}>
                  {'F1'}
                </Avatar>
                {`${field_value.value_1 || ''}`}
              </Chip>
              <Chip
                onClick={() =>
                  action_onModifyFieldValue(
                    record_index,
                    field[field_constants.KEY_FIELD_NAME],
                    field_value.value_2 || ''
                  )
                }
              >
                <Avatar size={32} backgroundColor={primary1Color}>
                  {'F2'}
                </Avatar>
                {`${field_value.value_2 || ''}`}
              </Chip>
            </div>
            <FieldInput
              autoFocus={true}
              canAutoPosition={true}
              changeField={(...params) =>
                action_onModifyFieldValue(
                  record_index,
                  field[field_constants.KEY_FIELD_NAME],
                  params[0],
                  params[params.length - 1]
                )
              }
              errorText={field_error}
              disabled={is_disabled || field_value.different === 0}
              field={field}
              floatingLabelText={''}
              name={field[field_constants.KEY_FIELD_NAME]}
              nextFocus={(event, key_down) =>
                action_onKeyPressFocus(
                  field[field_constants.KEY_FIELD_NAME],
                  key_down.goto
                )
              }
              onFocus={event =>
                action_onFocusField(field[field_constants.KEY_FIELD_NAME], true)
              }
              textFieldStyle={{ width: '100%' }}
              value={final_value}
            />
          </Paper>
        </ClickOutside>
      );
    } else {
      return (
        <FieldInput
          disabled={is_disabled || field_value.different === 0}
          field={field}
          errorText={field_error}
          floatingLabelFixed={true}
          floatingLabelText={field[field_constants.KEY_FIELD_DISPLAY]}
          name={field[field_constants.KEY_FIELD_NAME]}
          nextFocus={(event, key_down) => undefined}
          changeField={(...params) =>
            action_onModifyFieldValue(
              record_index,
              field[field_constants.KEY_FIELD_NAME],
              params[0],
              params[params.length - 1]
            )
          }
          onFocus={() =>
            action_onFocusField(field[field_constants.KEY_FIELD_NAME])
          }
          textFieldStyle={{ marginLeft: 20, marginRight: 20, width: '93%' }}
          value={final_value}
        />
      );
    }
  }
}

export default FieldItem;
