import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';//eslint-disable-line no-unused-vars
import TextField from 'material-ui/TextField';
import { I18n } from 'react-redux-i18n';//eslint-disable-line no-unused-vars
import InputLookup from '../input_lookup';
import FieldValidation from '../../field_validation/containers/field_validation_container'
import {
  COMPONENT_CHECKBOX,//eslint-disable-line no-unused-vars
  COMPONENT_COMBOBOX,//eslint-disable-line no-unused-vars
  COMPONENT_RADIO,//eslint-disable-line no-unused-vars
  COMPONENT_TEXTAREA,
  COMPONENT_TEXTFIELD
} from "../../../../constants";




import type { Element } from "react";
import { isEqual } from 'lodash';
type FieldType = {};
type MetaDataType = {
  field: FieldType,
  recordId: Number | String,
  tabIndex: Number | String
};
type ChangeFieldType = (
  value: String | Object | Boolean | Number,
  data: Object,
  metadata: MetaDataType
) => void;
type OnFocusFieldType = (
  event: Event,
  data: Object,
  metadata: MetaDataType
) => void;
type NextFocusType = (
  tabIndex: Number | String,
  data: Object,
  metadata: MetaDataType
) => void;

type DefaultProps = {
  single: Boolean,
  recordId: string | Number,
  data: string | Object
};
type Props = DefaultProps & {
  field: FieldType,
  record: Object,
  tabIndex: Number | string,
  onFocusField?: OnFocusFieldType,
  changeField?: ChangeFieldType,
  nextFocus?: NextFocusType,
  addRef: Function,
  errorStyle: Object,
  errorText: Element,
};
const getTitle = field =>
  field ? field.display_name || field.field_display || field.name : "";
/**
 * @param  data type Object,
 * @param   field type Field,
 * */
export default class InputField extends Component<DefaultProps, Props> {

  shouldComponentUpdate(nextProps) {
    const compareData = !isEqual(nextProps, this.props);

    return compareData;
  }
  constructor(props) {
    super(props);
    this.state = { validateText: '' }
  }
  static defaultProps = {
    single: true,
    recordId: 0,
    data: {}
  };
  render() {
    const {
      data,
      field,
      recordId,
      indexRow,
      tabIndex,
      single,
      onFocusField = () => undefined,
      onBlur = () => undefined,
      changeField = event => undefined,
      value,
      nextFocus,
      addRef,
      errorText,
      errorStyle,
      rows,
      focus,
      lockScroll,
      autoScroll,
      isCustomeValidate = !1,
      wrapStyle = {},
      ...other
    } = this.props;
    let InputField = TextField;
    let props = {
      key: `form-key-${tabIndex}`,
      name: `${recordId}-${field.name}`,
      onFocus: event => {
        if (onFocusField) {
          onFocusField(event, data, { field, recordId, tabIndex, indexRow });
        }
      },
      onBlur: event => {
        if (onFocusField) {
          onBlur(event, data, { field, recordId, tabIndex, indexRow });
        }
      },
      ref: node => { if (addRef) addRef(node, tabIndex) },
      lookupSource: field.lookup_source,
      indexRow: indexRow,
      ...other
    };
    if (tabIndex) {
      props.tabIndex = tabIndex;
    }

    let _control = field.control_type ? field.control_type.toUpperCase() : '';
    switch (_control) {
      default:
      case COMPONENT_TEXTAREA:
        props.multiLine = true;
        props.rows = rows || 1;
        if (single) {
          props.floatingLabelFixed = true;
          props.floatingLabelText = getTitle(field); // I18n.t(field.title);
        }
        props.onOpen = open => {
          if ("function" === typeof lockScroll) {
            lockScroll(open);
          }
        };
        props.fullWidth = true;
        props.value = value;
        props.field = field;
        props.broadcastChannel = recordId;
        props.nextFocus = nextFocus;
        props.errorText = errorText;
        props.errorStyle = errorStyle;
        props.onUpdateInput = (val, source, event) => {
          if (changeField)
            changeField(val, data, { field, recordId, tabIndex }, !1);
        };
        InputField = InputLookup;
        break;
      case COMPONENT_COMBOBOX:
        props.isCombobox = true
      case COMPONENT_TEXTFIELD: //eslint-disable-line
        if (single) {
          props.floatingLabelFixed = true;
          props.floatingLabelText = getTitle(field); // I18n.t(field.title);
        }
        props.onOpen = open => {
          if ("function" === typeof lockScroll) {
            lockScroll(open);
          }
        };
        props.fullWidth = true;
        props.value = value;
        props.field = field;
        props.nextFocus = nextFocus;
        props.errorText = errorText;
        props.errorStyle = errorStyle;
        props.broadcastChannel = recordId;
        props.readOnly = other.readOnly
        props.onUpdateInput = (val, source, event) => {
          if (changeField)
            changeField(val, data, { field, recordId, tabIndex }, !1);
        };
        InputField = InputLookup;
        break;
    }
    props.nextFocus = nextFocus;
    props = { ...props, ...other };
    var user = '', moduleName = '';
    if (this.props.other) {
      user = this.props.other.user;
      moduleName = this.props.other.moduleName;
    }
    var _field = { ...field };
    _field.row = indexRow;
    /**@link https://github.com/callemall/material-ui/issues/7779 
      *@Error Warning: React does not recognize the `valueLink` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `valuelink` instead. If you accidentally passed it from a parent component, remove it from the DOM element.
     * @Fixed Latest version of material-ui (version: 0.19)
     */
    //@TODO 
    return (<div style={{ ...wrapStyle }}>
      {!isCustomeValidate
        && <FieldValidation field={_field} getRecord={this.props.getRecord} user={user} moduleName={moduleName} />
      }

      <InputField {...props} field={field} autoScroll={autoScroll} />
    </div>

    )
  }
}
