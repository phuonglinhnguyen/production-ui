import React from 'react';

import DataSection from './invoice_data_section_component';
import DataSectionMulti from './section_multi_component';
import { isEqual } from 'lodash';

class KeyingInvoiceDocument extends React.Component {
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

  render() {
    const {
      Translate,
      action_addOrRemoveSectionItem,
      action_changeFieldMode,
      action_onBlurField,
      action_onFocusField = () => undefined,
      action_onKeyPressFocus = () => undefined,
      action_onModifyFieldValue = () => undefined,
      muiTheme,
      section_focused,
      anchor,
      data_record = {},
      error_record,
      field_focused,
      index_item_focused,
      is_empty_state,
      section_definitions,
      textarea_mode
    } = this.props;
    return (
      <div
        className="special_scroll"
        style={{
          flex: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          height: 'calc(100vh - 180px)'
        }}
      >
        {section_definitions.map((_s, index) => {
          if (_s.is_multiple) {
            return (
              <DataSectionMulti
                key={`section-${_s.name}-${index}`}
                Translate={Translate}
                action_addOrRemoveSectionItem={action_addOrRemoveSectionItem}
                action_changeFieldMode={action_changeFieldMode}
                action_onBlurField={action_onBlurField}
                action_onFocusField={action_onFocusField}
                action_onKeyPressFocus={action_onKeyPressFocus}
                action_onModifyFieldValue={action_onModifyFieldValue}
                anchor={anchor}
                data_section={data_record[_s.name]}
                error_section={error_record[_s.name]}
                field_focused={field_focused}
                index_item_focused={index_item_focused}
                is_empty_state={is_empty_state}
                muiTheme={muiTheme}
                section={_s}
                section_focused={section_focused}
                textarea_mode={textarea_mode && section_focused === _s.name}
              />
            );
          }
          return (
            <DataSection
              key={`section-${_s.name}-${index}`}
              Translate={Translate}
              action_onBlurField={action_onBlurField}
              action_onFocusField={action_onFocusField}
              action_onKeyPressFocus={action_onKeyPressFocus}
              action_onModifyFieldValue={action_onModifyFieldValue}
              data_section={data_record[_s.name]}
              error_section={error_record[_s.name]}
              field_focused={field_focused}
              is_empty_state={is_empty_state}
              muiTheme={muiTheme}
              section={_s}
            />
          );
        })}
        {!is_empty_state && (
          <div
            style={{
              display: 'inlineBlock',
              height: 'calc(50vh)',
              position: 'relative',
              width: '100%'
            }}
          />
        )}
      </div>
    );
  }
}

export default KeyingInvoiceDocument;
