import React, { Component } from 'react';
import InputField from './input_field';
import { debounce, isEqual } from 'lodash';
import { amber600 } from 'material-ui/styles/colors';

export default class FormSingle extends Component {
  constructor(props) {
    super(props);
    this.handleFocusFist = debounce(this.setFocusFirst, 100);
  }
  state = {
    position: null,
    focusIndex: -1,
  }
  static defaultProps = {
    indexBegin: 100000
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }
  removeRecord(recordId) {
    this.props.removeRecord(recordId);
  }

  onFocusField(event, data, { field, recordId, tabIndex }) {
    const { position } = this.state;
    if (field.position && field.position !== position) {
      this.setState({ position: field.position }, () => {
        this.props.onFocusField(field.position);
      })
    }
  }
  changeField = (val, data, { field, recordId, tabIndex }) => {
    const { changeField } = this.props;
    changeField(recordId, field.name, val, { data, field, tabIndex });
  }
  handleLockScroll(lock) {
    this.lock = lock;
  }

  nextFocus = (event, source, input) => {
    const { fields, focusSubmit } = this.props;
    let _currentIndex = input.props.tabIndex;
    let node;
    let needScroll = true;
    let focusIndex = -1
    switch (source.goto) {
      case 'left':
        focusIndex = _currentIndex
        break;
      case 'up':
        focusIndex = _currentIndex - 1;
        node = this._inputs[focusIndex];
        if (!node) {
          focusIndex = 100000 + fields.length - 1
          node = this._inputs[focusIndex];
        } else {
          needScroll = false;
        }
        if (node) {
          node.focus(needScroll);
        }
        break;
      case 'right':
        focusIndex = _currentIndex
        break;
      case 'down':
      case 'next':
        focusIndex = _currentIndex + 1;
        node = this._inputs[focusIndex];
        if (node) {
          node.focus(needScroll);
        } else {
          focusIndex = -1
          focusSubmit(event);
        }
        break;
      default:
        node = this._inputs[_currentIndex + 1];
        if (!node && event.key === 'Tab') {
          focusIndex = -1
          focusSubmit(event);
        }
        break;
    }
    this.setState({ focusIndex: focusIndex });
  }
  onFocusOut = (field, val) => {
    const { checkValidation } = this.props;
    setTimeout(() => {
      checkValidation(field.name, val)
    }, 1);
  }
  getBody() {
    const { record, fields, indexBegin,
      errorMap,
      warningMap,
      ignoreWarning,
      disabled,
      copyValue,
      rework_config,
    } = this.props;

    let errorStyle = {};
    if (!errorMap && warningMap) {
      errorStyle = { color: amber600 }
    }
    if (rework_config && rework_config.rework) {
      let rework_fields = rework_config.rework_fields;
      return fields.map((_field, index) => {
        let _tabIndex = index + indexBegin;
        let _val = record[_field.name] || '';
        let errorText = '';
        if (errorMap) {
          if (errorMap[_field.name]) {
            errorText = errorMap[_field.name].errorValidate ? errorMap[_field.name].errorValidate.map(item => item.message).join(', ') : errorMap[_field.name].errorPattern;
          }
        } else if (warningMap) {
          if (warningMap[_field.name]) {
            let ignores = []
            if (ignoreWarning && ignoreWarning[_field.name]) {
              ignores = ignoreWarning[_field.name].warnings.map(item => item.message);
            }
            errorText = warningMap[_field.name].warnings.map(item => {
              if (ignores.indexOf(item.message) > -1) {
                return 'ig:(' + item.message + ')'
              } else {
                return item.message
              }
            }).join(', ');
          }
        }
        return (<InputField
          key={`input-lookup-field-${index}`}
          autoScroll={!0}
          scroll_extenal={true}
          field={_field}
          record={record}
          recordId={0}
          copyValue={copyValue}
          tabIndex={_tabIndex}
          errorText={errorText}
          hintStyle={errorStyle}
          errorStyle={errorStyle}
          single={true}
          changeField={this.changeField}
          value={_val}
          onFocusField={this.onFocusField.bind(this)}
          lockScroll={(lock) => {
            this.handleLockScroll(lock);
          }}
          onBlur={() => this.onFocusOut(_field, _val)}
          disabled={disabled|| !rework_fields.includes(_field.name)}
          addRef={(node, tabIndex) => this._addRefInput(node, tabIndex)}
          nextFocus={this.nextFocus.bind(this)}
        />);
      });
    } else {
      return fields.map((_field, index) => {
        let _tabIndex = index + indexBegin;
        let _val = record[_field.name] || '';
        let errorText = '';
        if (errorMap) {
          if (errorMap[_field.name]) {
            errorText = errorMap[_field.name].errorValidate ? errorMap[_field.name].errorValidate.map(item => item.message).join(', ') : errorMap[_field.name].errorPattern;
          }
        } else if (warningMap) {
          if (warningMap[_field.name]) {
            let ignores = []
            if (ignoreWarning && ignoreWarning[_field.name]) {
              ignores = ignoreWarning[_field.name].warnings.map(item => item.message);
            }
            errorText = warningMap[_field.name].warnings.map(item => {
              if (ignores.indexOf(item.message) > -1) {
                return 'ig:(' + item.message + ')'
              } else {
                return item.message
              }
            }).join(', ');
          }
        }
        return (<InputField
          key={`input-lookup-field-${index}`}
          autoScroll={!0}
          scroll_extenal={true}
          field={_field}
          record={record}
          recordId={0}
          copyValue={copyValue}
          tabIndex={_tabIndex}
          errorText={errorText}
          hintStyle={errorStyle}
          errorStyle={errorStyle}
          single={true}
          changeField={this.changeField}
          value={_val}
          onFocusField={this.onFocusField.bind(this)}
          lockScroll={(lock) => {
            this.handleLockScroll(lock);
          }}
          onBlur={() => this.onFocusOut(_field, _val)}
          disabled={disabled}
          addRef={(node, tabIndex) => this._addRefInput(node, tabIndex)}
          nextFocus={this.nextFocus.bind(this)}
        />);
      });
    }
  }
  _onWheel = (e) => {
    if (this.lock) {
      e.preventDefault();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.focusError !== this.props.focusError) {
      let index = nextProps.fields.findIndex(item => item.name === nextProps.focusError.fieldName);
      this.setState({ focusIndex: nextProps.indexBegin + index });
    }
  }
  setFocusFirst = () => {
    const { indexBegin } = this.props;
    if (this._inputs && this._inputs[indexBegin] && this._inputs[indexBegin].focus) {
      this.focusFirst = true;
      this._inputs[indexBegin].focus();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { loadingForm } = this.props;
    if (!loadingForm) {
      if (!this.focusFirst) {
        this.handleFocusFist();
      }
    } else {
      this.focusFirst = !1;
    }
    if (prevProps.focusError !== this.props.focusError) {
      let index = this.props.fields.findIndex(item => item.name === this.props.focusError.fieldName);
      let node = this._inputs[this.props.indexBegin + index];
      if (node) {
        node.focus(true);
      }
    }

  }
  componentDidMount() {
    const { refForm } = this.props;
    const self = this;
    refForm && (refForm(self));
    if (this._content) {
      this._content.addEventListener("wheel", this._onWheel.bind(this));
    }
    this.mounted = true;
  }
  componentWillUnmount() {
    this.focusFirst = false;
    this.mounted = false;
    if (this._content) {
      this._content.removeEventListener("wheel", this._onWheel.bind(this));
    }
  }

  _addRef(node) {
    this._content = node;
  }
  _addRefInput(node, tabIndex) {
    if (!this._inputs) this._inputs = {};
    this._inputs[tabIndex] = node;
  }
  render() {
    const { width, height } = this.props;
    return (
      <div ref={node => this._addRef(node)} style={{ width: width - 16, height: height, overflow: 'auto' }}>
        {this.getBody()}
        <div style={{ display: 'inline-block', position: 'relative', width: '100%', height: height - 70 }} ></div>
      </div>
    );
  }
}
//className='special_scroll' 