import React from 'react';
import ReactDOM from 'react-dom';

import Subheader from 'material-ui/Subheader';

import DataFieldItem from './invoice_data_field_item_component';

import { isEqual } from 'lodash';

class KeyingInvoiceSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputHeight: 'calc(100vh - 196px)'
    };
  }

  componentDidMount() {
    let nodeStyle = null;
    if (this.refs['input-zone']) {
      nodeStyle = ReactDOM.findDOMNode(this.refs['input-zone']);
    }
    if (nodeStyle) {
      this.setState({
        inputHeight:
          window.innerHeight - nodeStyle.getBoundingClientRect().top - 20
      });
    }
  }

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
      // Translate, use later
      action_onBlurField,
      action_onFocusField = () => undefined,
      action_onKeyPressFocus = () => undefined,
      action_onModifyFieldValue = () => undefined,
      data_section = [{}],
      error_section = [{}],
      field_focused,
      is_empty_state,
      muiTheme,
      section
    } = this.props;
    return (
      <div style={{ margin: 5 }}>
        <Subheader inset={true}>{section.name}</Subheader>
        {section.fields.map((_field, index) => {
          return (
            <DataFieldItem
              key={`field-${_field.name}-${index}`}
              action_onBlurField={action_onBlurField}
              action_onFocusField={action_onFocusField}
              action_onKeyPressFocus={action_onKeyPressFocus}
              action_onModifyFieldValue={action_onModifyFieldValue}
              error_field={error_section[0][_field.name]}
              field={_field}
              final_value={data_section[0][_field.name]}
              is_disabled={is_empty_state}
              is_focus={_field.name === field_focused}
              muiTheme={muiTheme}
              section_name={section.name}
            />
          );
        })}
      </div>
    );
  }
}

export default KeyingInvoiceSection;
