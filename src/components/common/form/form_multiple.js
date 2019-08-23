import React, { Component } from 'react';
import InputField from './input_field';
import { debounce, isEqual } from 'lodash';
import { amber600 } from 'material-ui/styles/colors';



const getFieldNextEnable = (focusIndex, inputs_disable)=>{
    if(inputs_disable[focusIndex]){
       return getFieldNextEnable(focusIndex+1, inputs_disable)
    }
    return focusIndex;
} 
const getFieldPreviousEnable = (focusIndex, inputs_disable)=>{
  if(inputs_disable[focusIndex]){
     return getFieldPreviousEnable(focusIndex-1, inputs_disable)
  }
  return focusIndex;
} 

export default class FormMultiple extends Component {
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
        this.props.onFocusField(field.position_percent);
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
  nextFocusRequirdNext = (event, source, input) => {
    const { fields, indexBegin } = this.props;
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
          focusIndex = indexBegin
          node = this._inputs[focusIndex];
          node.focus(needScroll);
        }
        break;
      default:
        node = this._inputs[  + 1];
        if (!node && event.key === 'Tab') {
          focusIndex = indexBegin
          node = this._inputs[focusIndex];
          node.focus(needScroll);
        }
        break;
    }
    this.setState({ focusIndex: focusIndex });
  }
  nextFocus = (event, source, input) => {
    const { focusSubmit } = this.props;
    let _currentIndex = input.props.tabIndex;
    let node;
    let needScroll = true;
    let focusIndex = -1
    switch (source.goto) {
      case 'left':
        focusIndex = _currentIndex
        break;
      case 'up':
        focusIndex = getFieldPreviousEnable( _currentIndex - 1,this._inputs_disable);
        node = this._inputs[focusIndex];
        if (!node) {
          focusIndex = -1
          focusSubmit(event, false);
          // this.focusFirst=!1;
        } else {
          needScroll = false;
        }
        if (node) {
          node.focus(needScroll, this._content);
        }
        break;
      case 'right':
        focusIndex = _currentIndex
        break;
      case 'down':
      case 'next':
        focusIndex = getFieldNextEnable( _currentIndex + 1,this._inputs_disable);
        node = this._inputs[focusIndex];
        if (node) {
          node.focus(needScroll, this._content);
        } else {
          focusIndex = -1
          focusSubmit(event, true);
          //  this.focusFirst=!1;
        }
        break;
      default:
        node = this._inputs[_currentIndex + 1];
        if (!node && event.key === 'Tab') {
          focusIndex = -1
          focusSubmit(event, true);
          // this.focusFirst=!1;
        }
        break;
    }
    // this.setState({ focusIndex: focusIndex });
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
      record_selecting,
      copyValue,
      disabled,
      rework_config,
    } = this.props;
    if (rework_config && rework_config.rework) {
      let rework_fields = rework_config.rework_fields;
      return fields.map((_field, index) => {
        let errorStyle = {};
        let _tabIndex = index + indexBegin;
        let _val = record[_field.name] || '';
        let errorText = '';
        if (errorMap) {
          if (errorMap[_field.name]) {
            errorText = (errorMap[_field.name].errorValidate && errorMap[_field.name].errorValidate.map(item => item.message).join(', ')) || errorMap[_field.name].errorPattern;
          }
        }
        if (errorText.length === 0 && warningMap) {
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
            errorStyle = { color: amber600 }
          }
        }

        let _disable = disabled  || _field.disable || !rework_fields.includes(_field.name);



        return (<InputField
          key={`input-lookup-field-${index}`}
          autoScroll={!0}
          field={_field}
          record={record}
          recordId={record_selecting}
          tabIndex={_tabIndex}
          errorText={errorText}
          hintStyle={errorStyle}
          errorStyle={errorStyle}
          single={true}
          changeField={this.changeField}
          value={_val}
          scroll_extenal={false}
          popoverProps={{
            style: {
              background: 'rgba(255,255,255,0.85)'
            }
          }}
          scrollTo={{
            top: 0,
            left: 0,
            leftOffset: 0,
            topOffset: 144,
            behavior: "auto", block: "start", inline: "center"
          }}
          copyValue={copyValue}
          onFocusField={this.onFocusField.bind(this)}
          lockScroll={(lock) => {
            this.handleLockScroll(lock);
          }}
          onBlur={() => this.onFocusOut(_field, _val)}
          disabled={_disable}
          addRef={(node, tabIndex) => this._addRefInput(node, tabIndex, _disable)}
          nextFocus={this.nextFocus.bind(this)}
        />);
      });
    }
    return fields.map((_field, index) => {
      let errorStyle = {};
      let _tabIndex = index + indexBegin;
      let _val = record[_field.name] || '';
      let errorText = '';
      if (errorMap) {
        if (errorMap[_field.name]) {
          errorText = errorMap[_field.name].errorValidate && errorMap[_field.name].errorValidate.map(item => item.message).join(', ') || errorMap[_field.name].errorPattern;
        }
      }
      if (errorText.length === 0 && warningMap) {
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
          errorStyle = { color: amber600 }
        }
      }

      return (<InputField
        key={`input-lookup-field-${index}`}
        autoScroll={!0}
        field={_field}
        record={record}
        recordId={record_selecting}
        tabIndex={_tabIndex}
        errorText={errorText}
        hintStyle={errorStyle}
        errorStyle={errorStyle}
        single={true}
        changeField={this.changeField}
        value={_val}
        scroll_extenal={false}
        popoverProps={{
          style: {
            background: 'rgba(255,255,255,0.85)'
          }
        }}
        scrollTo={{
          top: 0,
          left: 0,
          leftOffset: 0,
          topOffset: 144,
          behavior: "auto", block: "start", inline: "center"
        }}
        copyValue={copyValue}
        onFocusField={this.onFocusField.bind(this)}
        lockScroll={(lock) => {
          this.handleLockScroll(lock);
        }}
        onBlur={() => this.onFocusOut(_field, _val)}
        disabled={disabled|| _field.disable}
        addRef={(node, tabIndex) => this._addRefInput(node, tabIndex, disabled|| _field.disable)}
        nextFocus={this.nextFocus.bind(this)}
      />);
    });
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
    let _indexBegin = getFieldNextEnable(indexBegin,this._inputs_disable)
    if (this._inputs && this._inputs[_indexBegin] && this._inputs[_indexBegin].focus) {
      this.focusFirst = true;
      this._inputs[_indexBegin].focus();
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
      if(this.props.focusError.fieldName==='__current_field__'){
        // let node = this._inputs[_indexBegin];
        // if (node) {
        //   node.focus(true);
        // }
      }else{
        let index = this.props.fields.findIndex(item => item.name === this.props.focusError.fieldName);
        let _indexBegin = getFieldNextEnable(this.props.indexBegin + index,this._inputs_disable)
        let node = this._inputs[_indexBegin];
        if (node) {
          node.focus(true);
        }
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
  _addRefInput(node, tabIndex, disable) {
    if (!this._inputs) this._inputs = {};
    if (!this._inputs_disable) this._inputs_disable = {};
    this._inputs[tabIndex] = node;
    this._inputs_disable[tabIndex] = disable;
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