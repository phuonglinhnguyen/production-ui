import React, { Component } from 'react';
import InputField from './input_field';
import { debounce } from 'lodash';
import { isEqual } from 'lodash';
import keycode from 'keycode';
const getColor = (fieldName, color, changed, fieldErrors) => {
  let _color;
  if (changed[fieldName]) {
    let _isErrors = fieldErrors.filter(field => field.name === fieldName)[0]
    if (_isErrors) {
      _color = color.error;
    } else {
      _color = color.no_error;
    }
  }
  return _color;
}
const KEY_OPEN_DIALOG = 'e'
export default class FormSingle extends Component {
  constructor(props) {
    super(props);
    this.handleFocusFist = debounce(this.setFocusFirst, 100);
    this.setLookedField = debounce(this.props.setLookedField, 50);
  }
  state = {
    position: null,
    focusIndex: -1,
    focusIndexPrevious: -1,
  }
  static defaultProps = {
    indexBegin: 100000
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  }
  removeRecord(recordId) {
    this.props.removeRecord(recordId);
  }

  onFocusField = (event, data, { field, recordId, tabIndex }) => {
    const { position } = this.state;
    if (field.position && field.position !== position) {
      this.setState({ position: field.position }, () => {
        this.props.onFocusField(field.position);
      })
    }
  }
  onFocusIn = (event, field, valueCurrent, initalValue, valuePrevious, tabIndex) => {
    this.focusingNode = tabIndex;
    this.props.onFocusField(field.position);
  }
  componentWillReceiveProps(nextProps) {
    const { focusField, openSubmit } = nextProps;
    if (focusField !== this.props.focusField) {
      let indexNode = this._fieldIndexs[focusField];
      if (indexNode) {
        this.setFocus(indexNode);
      }
    } else {
      if (!nextProps.qc_error.open && this.props.qc_error.open) {
        openSubmit && openSubmit();
        if (this.state.awaiting_field) {
          this.setState({ awaiting_field: undefined })
          if (nextProps.qc_error.field_errors.filter(item => item.name === this.state.awaiting_field).length === 0) {
            let indexNode = this._fieldIndexs[this.state.awaiting_field];
            if (indexNode) {
              this.setFocus(indexNode);
            }
          } else {
            if ('number' !== typeof this.focusingNode) {
            } else {
              if (this.focusingNode)
                this.setFocus(this.focusingNode);
            }
          }
        } else {
          if ('number' !== typeof this.focusingNode) {
          } else {
            if (this.focusingNode)
              this.setFocus(this.focusingNode);
          }
        }
      }
    }
    if (nextProps.focusError !== this.props.focusError) {
      let index = nextProps.fields.findIndex(item => item.name === nextProps.focusError.fieldName);
      this.setFocus(nextProps.indexBegin + index);
    }
  }
  handleKeyDown = (event, field, valueCurrent, initalValue, valuePrevious, _tabIndex) => {
    const self = this;
    const { openDialog, checkValidation, qc_error, clockSubmit } = this.props;
    if (event.altKey && keycode(event).toLowerCase() === KEY_OPEN_DIALOG) {
      event.preventDefault();
      event.stopPropagation();
      if (!qc_error.open && valueCurrent !== initalValue) {
        setTimeout(() => {
          checkValidation(field.name, valueCurrent);
        }, 0);
        clockSubmit && clockSubmit();
        // let fieldErrors = this.props.qc_error.field_errors
        setTimeout(() => {
          let _field = { ...field, keyed_data: initalValue, qced_data: valueCurrent }
          openDialog(_field);
          self.setState({ awaiting_field: field.name });
        }, 0)
      }
    }
  }
  onFocusOut = (event, field, valueCurrent, initalValue, valuePrevious, _tabIndex) => {
    const self = this;
    const { openDialog, checkValidation, qc_error, clockSubmit } = this.props;
    if (!qc_error.open) {
      if (valueCurrent !== initalValue) {
        setTimeout(() => {
          checkValidation(field.name, valueCurrent);
        }, 0);
        if (_tabIndex === this.focusingNode) {
          this.focusingNode = null;
        }
        clockSubmit && clockSubmit();
        let fieldErrors = this.props.qc_error.field_errors
        if (!(Array.isArray(fieldErrors) && fieldErrors.findIndex(_field => _field.name === field.name) !== -1)) {
          setTimeout(() => {
            let _field = { ...field, keyed_data: initalValue, qced_data: valueCurrent }
            openDialog(_field);
            self.setState({ awaiting_field: field.name });
          }, 0)
        }
      }else{
        if (this.props.qc_error.field_errors && this.props.qc_error.field_errors.length) {
          if (this.props.qc_error.field_errors.findIndex(_field => _field.name === field.name) !== -1) {
            this.props.removeError(field);
          }
        }
      }
    } 
    !this.props.qc_error.open && this.setLookedField(field.name);
  }
  changeField(val, data, { field, recordId, tabIndex }) {
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
          this.focusingNode = !1;
          focusSubmit(event);
        }
        break;
      default:
        node = this._inputs[_currentIndex + 1];
        if (!node && event.key === 'Tab') {
          focusIndex = -1
          this.focusingNode = !1;
          focusSubmit(event);
        }
        break;
    }
    this.setState({ focusIndex: focusIndex });
  }

  getBody() {
    const {
      record,
      initalRecord,
      recordPrevious,
      lookedRecord,
      fields,
      indexBegin,
      disabled,
      muiTheme,
      qc_error,
      errorMap
     } = this.props;
    const { qcReasonColor } = muiTheme;
    let errorRecord = errorMap[0];

    return fields.map((_field, index) => {
      let _tabIndex = index + indexBegin;
      let _valueCurrent = record[_field.name] || '';
      let _valuePrevious = recordPrevious[_field.name] || '';
      let _initalValue = initalRecord[_field.name] || '';
      let _color = getColor(_field.name, qcReasonColor, lookedRecord, qc_error.field_errors);

      let errorText = '';
      if (errorRecord && errorRecord[_field.name]) {
        errorText = errorRecord[_field.name].errorValidate || errorRecord[_field.name].errorPattern;
      }
      return (<InputField
        key={`input-lookup-field-${index}`}
        autoScroll={!0}
        field={_field}
        record={record}
        recordId={0}
        tabIndex={_tabIndex}
        onKeyDown={event => this.handleKeyDown(event, _field, _valueCurrent, _initalValue, _valuePrevious, _tabIndex)}
        single={true}
        errorText={errorText}
        changeField={(...params) => this.changeField(...params)}
        value={_valueCurrent}
        floatingLabelStyle={_color ? { color: _color.background } : {}}
        underlineFocusStyle={_color ? { color: _color.background } : {}}
        onFocusField={this.onFocusField}
        lockScroll={(lock) => {
          this.handleLockScroll(lock);
        }}
        onFocus={e => this.onFocusIn(e, _field, _valueCurrent, _initalValue, _valuePrevious, _tabIndex)}
        onBlur={e => this.onFocusOut(e, _field, _valueCurrent, _initalValue, _valuePrevious, _tabIndex)}
        disabled={disabled}
        addRef={(node, tabIndex) => this._addRefInput(node, tabIndex, _field.name)}
        nextFocus={(event, source, input) => this.nextFocus(event, source, input)}
      />);
    });
  }
  _onWheel = (e) => {
    if (this.lock) {
      e.preventDefault();
    }
  }
  setFocusFirst = () => {
    const { indexBegin } = this.props;
    if (this._inputs && this._inputs[indexBegin] && this._inputs[indexBegin].focus) {
      this.focusFirst = true;
      this._inputs[indexBegin].focus();
    }
  }
  setFocusPrevious = () => {
    this.setState({ focusIndexPrevious: -1, focusIndex: this.state.focusIndexPrevious });
  }
  setFocus = (index) => {
    const { focusSubmit } = this.props;
    if (this.state.goSubmit) {
      this.setState({ gotoFocus: !1, goSubmit: !1 }, () => {
        setTimeout(() => {
          focusSubmit();
        }, 0)
      })
    } else {
      if (this._inputs && this._inputs[index] && this._inputs[index].focus) {
        let _node = this._inputs[index];
        this.setState({ gotoFocus: !1 }, () => {
          setTimeout(() => {
            _node.focus();
          }, 0)
        })

      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { loadingForm, qc_error } = this.props;
    if (!loadingForm) {
      if (!this.focusFirst) {
        this.handleFocusFist();
      }
    } else {
      this.focusFirst = !1;
    }
    if (!qc_error.open)
      if (this.state.gotoFocus) {
        this.setFocus(this.state.focusIndex);
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
  _addRefInput(node, tabIndex, fieldName) {
    if (!this._inputs) this._inputs = {};
    this._inputs[tabIndex] = node;
    this._fieldIndexs = this._fieldIndexs || {};
    this._fieldIndexs[fieldName] = tabIndex;
  }
  render() {
    const { width, height } = this.props;
    return (
      <div className='special_scroll' ref={node => this._addRef(node)} style={{ width: width - 16, height: height, overflow: 'auto' }}>
        {this.getBody()}
        <div style={{ display: 'inline-block', position: 'relative', width: '100%', height: height - 70 }} ></div>
      </div>
    );
  }
}
