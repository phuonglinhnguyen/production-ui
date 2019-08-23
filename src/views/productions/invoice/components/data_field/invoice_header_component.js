import React from 'react';
import ReactDOM from 'react-dom';

import Subheader from 'material-ui/Subheader';
import { Card, CardHeader, CardActions } from 'material-ui/Card';

import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import DataFieldItem from './invoice_data_field_item_component';
import SectionMultiple from './section_multi_component';

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
        let element = nextProps[key];
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
      action_onFocusField = () => undefined,
      action_onKeyPressFocus = () => undefined,
      action_onModifyFieldValue = () => undefined,
      data_section = [{}],
      field_focused,
      index_item_focused,
      is_empty_state,
      muiTheme,
      section
    } = this.props;

    return <Card />;
  }
}

export default KeyingInvoiceSection;
