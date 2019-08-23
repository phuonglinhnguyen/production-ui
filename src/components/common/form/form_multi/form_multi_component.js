import React, { Component } from "react";
import InputFieldMultiComponent from "../input_field/input_field_component";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import _ from "lodash";
import ReactDOM from 'react-dom';
import { amber600 } from 'material-ui/styles/colors'
const FIELD_WIDTH=150;
class FormMulti extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.nextFocus = this.nextFocus.bind(this);
    this.onFocusField = this.onFocusField.bind(this);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this._body).addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    if (this._body) {
      ReactDOM.findDOMNode(this._body).removeEventListener('scroll', this.handleScroll);
    }

  };

  handleScroll(event) {
    const scrollLeft = ReactDOM.findDOMNode(this._body).scrollLeft

    ReactDOM.findDOMNode(this._header).scrollLeft = scrollLeft;

  };

  _addRef(node) {
    this._body = node;
  }
  _addRefInput(node, _tabIndex) {

    if (!this._inputs) this._inputs = {};
    const tabIndex = _tabIndex || 0;
    this._inputs[tabIndex] = node;
  }
  onFocusField = (event, data, item) => {
    var { tabIndex } = item;

    const { width } = this.props;

    const left = ReactDOM.findDOMNode(this._inputs[tabIndex]).getBoundingClientRect().left + FIELD_WIDTH;

    if (left > width) {
      ReactDOM.findDOMNode(this._inputs[tabIndex]).scrollIntoView({ inline: "end" })
    }
    if (this.props.onFocusField) {
      this.props.onFocusField(event, data, item)
    }
  }


  nextFocus = (event, source, input) => {

    const { fields } = this.props;

    let _currentIndex = event.target.tabIndex;

    let node;

    switch (source.goto) {
      case "left":
        node = this._inputs[_currentIndex - 1];

        break;
      case "right":
      case "tab":
      case "next":
        node = this._inputs[_currentIndex + 1];

        break;
      case "down":
        node = this._inputs[_currentIndex + fields.length];

        break;

      case "up":
        node = this._inputs[_currentIndex - fields.length];

        break;

      default:
        break;
    }
    if (node) {

      node.focus(source.goto);

    }
  };
  getHeader() {
    const { fields, records, width } = this.props;
    const overflow = records && records.length > 0 ? "hidden" : "auto"

    return <Table
      ref={node => this._header = node}
      selectable={false}

      style={{ minWidth: FIELD_WIDTH * fields.length }}
      wrapperStyle={{ overflowX: overflow, overflowY: overflow, width: width }}
    >
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          {fields.map((_field, index) => (
            <TableHeaderColumn key={index} style={{ fontWeight: 600, padding: 4 }}>
              {_field.field_display}
            </TableHeaderColumn>
          ))}
        </TableRow>
      </TableHeader>
    </Table>
  }
  getWarningText(warningRecord, _field) {
    let warnings = warningRecord[_field.name].warnings;
    let warningText = warnings.reduce((prevVal, elem) => `${prevVal} ${elem.message} ,`, "");

    return warningText;
  }
  getRows(height) {
    const {
      records,
      fields,
      editColumn,
      errorMap,
      warningMap,
      onKeyDown,
      onBlur
    } = this.props;
    var self = this;
    let length = editColumn ? records.length : fields.length;

    return <Table
      ref={node => this._addRef(node)}
      selectable={false}
      height={`${height - 30}px`}
      style={{ minWidth: FIELD_WIDTH * fields.length }}
      bodyStyle={{ overflowY: "", overflowX: "" }}
    >
      <TableBody displayRowCheckbox={false}>{
        records.map((record, indexRow) => {
          let errorRecord = errorMap[indexRow];
         
          let warningRecord = warningMap[indexRow];
          return (
            <TableRow key={`row-record-${indexRow}`}>
              {fields.map((_field, index) => {
                let _value = record[_field.name];
                let errorText = "", warningText = "";
                if (errorRecord && errorRecord[_field.name]) {
                  if(  errorRecord[_field.name].errorValidate){
                    errorText=errorRecord[_field.name].errorValidate.length>0&&errorRecord[_field.name].errorValidate[0].message
                  }else  if(  errorRecord[_field.name].errorPattern){
                    errorText=errorRecord[_field.name].errorPattern.length>0&&errorRecord[_field.name].errorPattern[0].message
                  }
                 
                } else if (warningRecord && warningRecord[_field.name]) {
                  warningText = self.getWarningText(warningRecord, _field);
                }
                return (
                  <TableRowColumn key={index} style={{ padding: 4 }}>
                    <RowComponent
                      _field={_field}
                      length={length}
                      _value={_value}
                      indexRow={indexRow}
                      indexCol={index}
                      addRef={(node, tabIndex) => this._addRefInput(node, tabIndex)}
                      errorText={errorText}
                      warningText={warningText}
                      nextFocus={this.nextFocus}
                      multiLine={true}
                      onFocusField={this.onFocusField}
                      onBlur={onBlur}
                      onKeyDown={onKeyDown}
                    />
                  </TableRowColumn>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  }
  render() {
    const { height, actions } = this.props;
    return (
      <div>
        {actions ? actions : ""}

        {this.getHeader(height)}

        {this.getRows(height)}
      </div>
    );
  }
}
export default FormMulti;

class RowComponent extends Component {
  shouldComponentUpdate(nextProps) {
    const update = !_.isEqual(this.props._value, nextProps._value) ||
      !_.isEqual(this.props.errorText, nextProps.errorText) ||
      !_.isEqual(this.props.warningText, nextProps.warningText);

    return update;
  }
  render() {
    const { _field,
      _value,
      indexRow,
      indexCol,
      errorText,
      warningText,
      length,
      nextFocus,
      onFocusField,
      onKeyDown,
      onBlur,
      addRef
   } = this.props;

    let _tabIndex = indexRow * length + indexCol;
    _tabIndex++;
    let data = {
      row: indexRow,
      col: indexCol,
      name: _field.name,
      field_display: _field.field_display
    };
    let errorStyle = warningText ? { color: amber600 } : {}

    return <InputFieldMultiComponent
      single={false}
      key={`input-key${_tabIndex}`}
      field={_field}
      canAutoPosition={true}
      tabIndex={_tabIndex}
      value={_value}
      indexRow={indexRow}
      data={data}
      addRef={addRef}
      name={`${_field.name}_${_tabIndex}`}
      errorText={errorText || warningText}
      errorStyle={errorStyle}
      nextFocus={nextFocus}
      multiLine={true}
      onFocusField={onFocusField}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      popoverProps={{
        style: {
          background: 'rgba(255,255,255,0.4)'
        }
      }}
    />
  }
}

