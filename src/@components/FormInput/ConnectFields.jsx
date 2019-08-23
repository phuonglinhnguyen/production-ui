// @flow strict
import * as React from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom'
import { bindActionCreators } from 'redux';
import { getDataObject } from '@dgtx/coreui';
import { TextField, Input, FormControl, Popper, Fade, Typography, Paper } from '@material-ui/core'
import {
    handleOnFocus, handleOnBlur,
    handleChange, handleCoppy,
    handleNextField, checkValidationField,
    handleFocusShortcut, handleCoppyShortcut,
    handleChanging,
    initFieldElement,
    changeDisableField
} from './handlers'
import { isEqual } from 'lodash'
import { getIn, removeWordInFieldValue, formatFieldValue, getEffectDynamicField } from './utils'
import { debounce } from '../../utils/common'
import InputLookup from '../InputLookup';
import InputLabel from '../InputLookup/Inputs/InputLableInline/InputLableInline'
import CellTableLookup from '../InputLookup/Inputs/InputTable/CellTableLookup'
import FormHelperText from '../InputLookup/Inputs/FormHelperText'
import InputLableInlineWrapper from '../InputLookup/Inputs/InputLableInline/InputLableInlineWrapper'

const variantComponent = {
    standard: TextField,
    inline: Input,
    table: Input,
};
class ConnectField extends React.Component<Props> {
    static defaultProps = {
        variant: "standard",
    }
    constructor(props: Props) {
        super(props);
        this.labelRef = React.createRef();
        let value = props.fieldData.value;
        if (value) {
            this.state = {
                value: {
                    text: "",
                    words: [],
                    ...value
                }
            }
        } else {
            this.state = {
                value: {
                    text: "",
                    words: [],
                }
            }
        }
        this.handleChangeDebounce = debounce(this.handleChangeDebounce, 150);
    }
    componentDidMount() {
        const self = this;
        /**@description auto focus first field  */
        const { name, fieldData: { isActive, fieldState }, content, initFieldElement } = this.props;
        if (isActive) {
            setTimeout(() => {
                self.focus(true)
            }, 200)
        }
        const {
            fieldData: {
                value
            } } = this.props;
        initFieldElement({ fieldName: name, element: this })
        this.setState({ value })
    }

    componentWillReceiveProps(nextProps: Props) {
        const {
            fieldData: {
                value
            } } = nextProps;
        if (!isEqual(this.props.fieldData.value, value)) {
            this.setState({ value })
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {
        return !isEqual(this.props, nextProps)
    }
    handleChange = (data) => {
        const { fieldData: { value, fieldState }, handleChanging } = this.props;
        if (value.words && value.words[0] && value.words[0].points) {
            this.awaitChange = true;
            !fieldState.touching && handleChanging({ ...data, value: value })
            data.value = value
            this.setState({ value: value })
            this.handleChangeDebounce(data)
        } else {
            this.awaitChange = true;
            !fieldState.touching && handleChanging({ ...data, value: this.state.value })
            data.value = removeWordInFieldValue(value, data.value)
            this.setState({ value: data.value })
            this.handleChangeDebounce(data)
        }
    }

    handleChangeDebounce = (data) => {
        const { handleChange } = this.props;
        handleChange && handleChange(data)
        // checkValidationField(data)
        this.awaitChange = false;
    }
    componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {
        const self = this;
        const {
            content,
            fieldData: { isActive, fieldState }
        } = this.props;
        if (isActive) {
            this.focus(!this.click)
            this.click = false;
            if (prevProps.disabled) {
                setTimeout(() => {
                    self.focus(true)
                }, 200)
            }
        }
    }
    focus = (isScroll = false) => {
        const { content } = this.props;
        try {
            this.refs.input.focus(isScroll, findDOMNode(content.refs.content))
        } catch (error) {

        }
    }
    handleOnBlur = (data) => () => {
        const { fieldData: { fieldState } } = this.props;
        if (this.awaitChange) {
            this.handleChangeDebounce.flush();
            this.props.checkValidationField({ ...data, value: this.state.value })
        } else if (!fieldState.touched || !isEqual(fieldState.touched, this.state.value)) {
        }
        this.props.checkValidationField({ ...data, value: this.state.value })
    }
    render() {
        const {
            name,
            rowId,
            id,
            current,
            content,
            variant,
            autoScroll,
            handleCoppy,
            handleCoppyShortcut,
            handleFocusShortcut,
            shortcutFieldCopy,
            shortcutFieldFocus,
            sectionName,
            handleChange,
            handleOnBlur,
            handleOnFocus,
            handleNextField,
            fieldData: {
                isActive,
                fieldState,
                error,
                warning,
                lookupLang
            },
            disabled,
            multiLine,
            ...rest } = this.props;
        const { value } = this.state;
        let helperText;
        if (Boolean(error)) {
            helperText = error[0].message
        } else if (Boolean(warning)) {
            if (warning.ignore) {
                helperText = 'Ig:' + warning.datas[0].message
            } else {
                helperText = warning.datas[0].message
            }
        }
        let _disabled = disabled || fieldState.disable;
        const InputComponent = variantComponent[variant]
        if (!fieldState.visible) {
            return '';
        }
        const EnchoComponent = (
            <InputLookup {...rest}
                ref='input'
                current={current}
                lookupLang={lookupLang}
                validating={fieldState.validating}
                disabled={_disabled}
                component={InputComponent}
                shortcutFieldCopy={shortcutFieldCopy}
                shortcutFieldFocus={shortcutFieldFocus}
                autoScroll={autoScroll}
                warning={!Boolean(error) && Boolean(warning)}
                error={(Boolean(error) || Boolean(warning))}
                helperText={helperText}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                scrollTo={{
                    top: 250,
                    left: 0,
                    leftOffset: 0,
                    topOffset: 144,
                    behavior: 'auto',
                    block: 'start',
                    inline: 'start',
                }}
                value={value.text || ''}
                copyValue={(fieldName, callback) => {
                    handleCoppy({
                        sectionName,
                        rowId,
                        fieldName
                    }, callback)
                }}
                copyValueShortcut={(fieldName, callback) => {
                    handleCoppyShortcut({
                        sectionName,
                        rowId,
                        fieldName
                    }, callback)
                }}
                focusFieldShortcut={(fieldName) => {
                    handleFocusShortcut({
                        sectionName,
                        rowId,
                        fieldName
                    })
                }}
                onUpdateInput={data => {
                    this.handleChange({
                        value: { ...value, text: data },
                        sectionName,
                        rowId,
                        fieldName: name
                    })
                }
                }
                onBlur={this.handleOnBlur({ sectionName, rowId, fieldName: name })}
                onClick={event => {
                    this.click = true;
                }}
                onFocus={event => {
                    if (!isActive) {
                        handleOnFocus({ sectionName, rowId, fieldName: name })
                    }
                }}
                onChangeDisable={(isDisable) => {
                    this.props.changeDisableField({ sectionName, rowId, fieldName: name, isDisable })
                }}
                nextFocus={(event, source, input) => {
                    if (!event.altKey) {
                        this.handleChangeDebounce.flush();
                        if (!fieldState.touched || !isEqual(fieldState.touched, this.state.value)) {
                            this.props.checkValidationField({ sectionName, rowId, fieldName: name, value: this.state.value })
                        }
                        handleNextField({ sectionName, rowId, fieldName: name, source })
                    }
                }
                }
            />
        );

        const Fragment = (props) => props.children;
        if (variant === "inline") {
            const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
            return (
                <FormControl
                    aria-describedby={helperTextId}
                    error={!!helperText}
                    component={React.Fragment}
                    fullWidth={true}

                // required={required}
                // variant={variant}
                // {...other}
                >
                    <InputLableInlineWrapper active={isActive && !_disabled}>
                        <td style={fieldState.highlight ? { background: "rgba(255,211,68,0.4)", width: '25%' } : { width: '25%' }}>
                            {rest.label && (
                                <InputLabel htmlFor={id} ref={this.labelRef} >
                                    {rest.label}
                                </InputLabel>
                            )}

                        </td>
                        <td style={fieldState.highlight ? { background: "rgba(255,211,68,0.4)" } : {}}>
                            {EnchoComponent}
                            {helperText && (
                                <FormHelperText id={helperTextId}
                                    warning={!Boolean(error) && Boolean(warning)}
                                >
                                    {helperText}
                                </FormHelperText>
                            )}
                        </td>
                    </InputLableInlineWrapper>
                </FormControl >
            );
        } else if (variant === "table") {
            const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
            return (
                <FormControl
                    aria-describedby={helperTextId}
                    error={!!helperText}
                    component={React.Fragment}
                    fullWidth={true}
                // required={required}
                // variant={variant}
                // {...other}
                >
                    <CellTableLookup
                        style={fieldState.highlight ? { background: "rgba(255,211,68,0.4)" } : {}}
                        active={isActive && !_disabled}
                        warning={!Boolean(error) && Boolean(warning)}
                        onClick={event => {
                            // if (event.target.tagName !== "INPUT") {
                            //     handleOnFocus({
                            //         sectionName,
                            //         rowId,
                            //         fieldName: name
                            //     })
                            //     this.focus()
                            // }
                        }}>
                        {EnchoComponent}
                        {helperText && (
                            <FormHelperText
                                // style={{ position: 'absolute', bottom: "-12px" }}
                                warning={!Boolean(error) && Boolean(warning)}
                                id={helperTextId} >
                                {helperText}
                            </FormHelperText>
                        )}
                    </CellTableLookup>
                    {/* <td style={{
                        height: 'inherit',
                        padding: '3px 3px !important',
                        position: "relative",
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                        verticalAlign: 'initial'
                    }}
                        onClick={event => {
                            if (event.target.tagName !== "INPUT") {
                                this.focus()
                            }
                        }}
                    >
                        <div style={{
                            width: '100%', height: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            {EnchoComponent}
                            {helperText && (
                                <FormHelperText
                                    // style={{ position: 'absolute', bottom: "-12px" }}
                                    id={helperTextId} >
                                    {helperText}
                                </FormHelperText>
                            )}
                        </div>
                    </td> */}
                </FormControl >
            );
        }
        return EnchoComponent;
    }
}
const mapStateToProps = (state: any, ownProps: any) => {
    const {
        name,
        rowId,
        sectionName,
        switchDisable,
        field
    } = ownProps;
    const {
        fields = {},
        current = 0,
        value = {},
        error = {},
        warning = {},
        active,
        lookup_lang,
    } = getDataObject('core.resources.form.data', state) || {};
    let fieldState = getDataObject(`${sectionName}.${rowId}.${name}`, fields[current]) || {}
    let valueField = getDataObject(`${sectionName}.${rowId}.${name}`, value) || { text: '', words: [] }
    // if (!valueField) {
    //     if (getDataObject('core.resources.form_state.data.ready', state)) {
    //         valueField = { text: field.default_value, words: [] }
    //     } else {
    //         valueField = { text: '', words: [] }
    //     }
    // }
    let errorField = getIn(error, { sectionName, rowId, fieldName: name })
    let warningField = getIn(warning, { sectionName, rowId, fieldName: name })
    let isActive = active && active.sectionName === sectionName && active.rowId === rowId && active.fieldName === name;
    let lookupLang;
    if (lookup_lang) {
        try {
            lookupLang = getDataObject([lookup_lang.sectionName, 0, lookup_lang.fieldName], value).text
        } catch (error) {

        }
    }
    let _switchDisable = switchDisable;
    if (typeof fieldState.switch_disable !== "undefined") {
        _switchDisable = fieldState.switch_disable
    }
    return {
        ...ownProps,
        current,
        switchDisable: _switchDisable,
        fieldData: {
            lookupLang,
            isActive,
            fieldState,
            value: valueField,
            error: errorField,
            warning: warningField,
        }
    }
}
const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    handleChange,
    handleOnFocus,
    handleOnBlur,
    checkValidationField,
    handleNextField,
    handleCoppy,
    handleCoppyShortcut,
    handleFocusShortcut,
    handleChanging,
    initFieldElement,
    changeDisableField
}, dispatch)

const connector = connect(mapStateToProps, mapDispatchToProps)(ConnectField)
export default connector;


