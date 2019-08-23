import React from 'react';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';

import FieldInput from '../../../../../components/common/form/input_field';
import {
  KeyingMultiTextField,
  KeyingMultiTableRow
} from './section_multi_body_component';
import InvoiceTextarea from './invoice_textarea_component';

import { isEqual } from 'lodash';

import {
  KEY_FIELD_DISPLAY,
  KEY_FIELD_NAME
} from '../../../../../constants/field_constants';

class KeyingInvoiceMulti extends React.Component {
  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  renderHeader(header) {
    const { muiTheme } = this.props;
    return (
      <TableRow>
        <TableHeaderColumn
          key={`header-index`}
          style={{
            width: 20,
            borderRight: `1px ${muiTheme.palette.background3Color} solid`
          }}
        />
        {header.map((_h, i) => {
          // if (!_h.visible) {
          //   return null;
          // }
          return (
            <TableHeaderColumn
              key={`header-${_h.name}-${i}`}
              style={{
                width: 100,
                borderRight: `1px ${muiTheme.palette.background3Color} solid`,
                display : _h.visible ? null : 'none'
              }}
            >
              {_h[KEY_FIELD_DISPLAY]}
            </TableHeaderColumn>
          );
        })}
      </TableRow>
    );
  }

  renderFieldFocus(
    action_onModifyFieldValue,
    action_onKeyPressFocus,
    action_onFocusField,
    data_item,
    { fields, field_item },
    { error_text, error_color },
    { primary1Color, alternateTextColor },
    item_index,
    ref,
    visible
  ) {
    let { words, text } = data_item[field_item.name];
    return (
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
            field_item[KEY_FIELD_NAME]
          );
        }}
        errorStyle={{ color: error_color }}
        errorText={error_text}
        field={field_item}
        floatingLabelText={''}
        name={field_item[KEY_FIELD_NAME]}
        nextFocus={(event, key_down) =>
          action_onKeyPressFocus(
            field_item[KEY_FIELD_NAME],
            key_down.goto,
            item_index,
            fields
          )
        }
        onFocus={event =>
          action_onFocusField(field_item[KEY_FIELD_NAME], item_index, true)
        }
        textFieldStyle={{
          width: '100%',
          backgroundColor: alternateTextColor
        }}
        ref={ref}
        underlineStyle={{ borderColor: primary1Color }}
        value={text || ''}
      />
    );
  }

  render() {
    const {
      // Translate, use later
      action_addOrRemoveSectionItem,
      action_changeFieldMode,
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      anchor,
      data_section = [{}],
      error_section = [{}],
      field_focused = '',
      index_item_focused,
      is_empty_state = true,
      muiTheme,
      section = {},
      section_focused,
      textarea_mode
    } = this.props;
    return (
      <div>
        <div style={{ display: '-webkit-box' }}>
          <Subheader style={{ width: '80%' }} inset={true}>
            {section.name}
          </Subheader>
          {/* {!is_empty_state && (
            <FloatingActionButton
              mini={true}
              onClick={() =>
                action_addOrRemoveSectionItem(
                  index_item_focused + 1,
                  section.name
                )
              }
            >
              <AddItemIcon color={muiTheme.palette.primary1Color} />
            </FloatingActionButton>
          )} */}
        </div>
        <Table
          bodyStyle={{
            overflowY: 'scroll',
            maxHeight: 300
          }}
          fixedHeader={false}
          selectable={false}
        >
          <TableHeader
            adjustForCheckbox={false}
            displaySelectAll={false}
            enableSelectAll={false}
          >
            {this.renderHeader(section.fields)}
          </TableHeader>
          {!is_empty_state && (
            <TableBody
              displayRowCheckbox={false}
              style={{
                backgroundColor: muiTheme.palette.background2Color
              }}
            >
              {data_section.map((_d, index) => {
                if (
                  index_item_focused === index &&
                  section_focused === section.name
                ) {
                  return (
                    <KeyingMultiTextField
                      key={`${section.name}-item-${index}`}
                      action_addOrRemoveSectionItem={
                        action_addOrRemoveSectionItem
                      }
                      action_changeFieldMode={action_changeFieldMode}
                      action_onFocusField={action_onFocusField}
                      action_onKeyPressFocus={action_onKeyPressFocus}
                      action_onModifyFieldValue={action_onModifyFieldValue}
                      action_renderFieldFocus={this.renderFieldFocus}
                      data_item={_d}
                      error_section={error_section[index]}
                      field_focused={field_focused}
                      fields={section.fields}
                      item_index={index_item_focused}
                      muiTheme={muiTheme}
                      section_name={section.name}
                      textarea_mode={textarea_mode}
                    />
                  );
                }
                return (
                  <KeyingMultiTableRow
                    key={`${section.name}-${index}`}
                    action_onFocusField={action_onFocusField}
                    data_item={_d}
                    error_section={error_section[index]}
                    field_focused={field_focused}
                    fields={section.fields}
                    item_index={index}
                    muiTheme={muiTheme}
                  />
                );
              })}
            </TableBody>
          )}
        </Table>
        {textarea_mode && (
          <InvoiceTextarea
            action_addOrRemoveSectionItem={action_addOrRemoveSectionItem}
            action_onFocusField={action_onFocusField}
            action_onKeyPressFocus={action_onKeyPressFocus}
            action_onModifyFieldValue={action_onModifyFieldValue}
            action_renderFieldFocus={this.renderFieldFocus}
            anchor={anchor}
            data_section={data_section}
            error_section={error_section}
            field_focused={field_focused}
            index_item_focused={index_item_focused}
            muiTheme={muiTheme}
            section={section}
            textarea_mode={textarea_mode}
          />
        )}
      </div>
    );
  }
}

export default KeyingInvoiceMulti;
