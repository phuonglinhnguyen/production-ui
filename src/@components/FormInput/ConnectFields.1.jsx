// @flow strict
import * as React from 'react';
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux';
import { getDataObject } from '@dgtx/coreui';
import { bindActionCreators } from 'redux';
import { handleChange, handleOnBlur, handleOnFocus, handleNextField, handleCoppy, handleCoppyShortcut, handleFocusShortcut } from './actions'
import { isEqual } from 'lodash'
import { getIn, removeWordInFieldValue, formatFieldValue } from './utils'
import { debounce } from '../../utils/common'
import InputLookup from '../InputLookup';
import { TextField, Input, FormControl, Popper, Fade, Typography, Paper } from '@material-ui/core'
import InputLabel from '../InputLookup/Inputs/InputLableInline/InputLableInline'
import CellTableLookup from '../InputLookup/Inputs/InputTable/CellTableLookup'
import FormHelperText from '../InputLookup/Inputs/FormHelperText'
import InputLableInlineWrapper from '../InputLookup/Inputs/InputLableInline/InputLableInlineWrapper'

const variantComponent = {
    standard: TextField,
    inline: Input,
    table: Input,
};
console.log('=============React.Fragment======================');
console.log(React.Fragment);
console.log('====================================');
class ConnectField extends React.Component<Props> {
    static defaultProps = {
        variant: "standard",
    }
    constructor(props: Props) {
        super(props);
        this.labelRef = React.createRef();
        this.state = {
            value: {
                text: "",
                words: [],
            }
        }
        this.handleChangeDebounce = debounce(this.handleChangeDebounce, 150);
    }
    componentDidMount() {
        const self = this;
        /**@description auto focus first field  */
        const { fieldData: { fieldState }, content } = this.props;
        if (fieldState.active) {
            setTimeout(() => {
                self.refs.input.focus(true, findDOMNode(content.refs.content))
            }, 200)
        }
        const {
            fieldData: {
                value
            } } = this.props;
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
        // || this.props.disabled !== nextProps.disabled

    }

    handleChange = (data) => {
        const { fieldData: { value } } = this.props;
        data.value = removeWordInFieldValue(value, data.value)
        this.setState({ value: data.value })
        this.handleChangeDebounce(data)
    }

    handleChangeDebounce = (data) => {
        const { handleChange } = this.props;
        handleChange && handleChange(data)
    }
    componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {
        const self = this;
        const {
            content,
            fieldData: { fieldState }
        } = this.props;
        if (fieldState.active) {
            this.setFocus = true;
            this.refs.input.focus(!this.click, findDOMNode(content.refs.content))
            this.click = false;
            if (prevProps.disabled) {
                setTimeout(() => {
                    self.refs.input.focus(true, findDOMNode(content.refs.content))
                }, 200)
            }
        } else if (prevProps.fieldData.fieldState.active) {
            this.setBlur = true;
        }
    }
    focus = (isScroll = false) => {
        const { content } = this.props;
        try {
            this.refs.input.focus(isScroll, findDOMNode(content.refs.content))
        } catch (error) {

        }
    }
    componentWillUnmount() {
    }
    handleOnBlur = () => {
        const { field, handleOnBlur, sectionName, rowId, name } = this.props;
        const { value } = this.state;
        this.handleChangeDebounce.clear();
        handleOnBlur({
            sectionName,
            rowId,
            fieldName: name,
            value: { ...value, text: formatFieldValue(field, value.text) },
        })
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
                fieldState,
                error,
                warning
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

        const EnchoComponent = (
            <InputLookup {...rest}
                ref='input'
                current={current}
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



                onBlur={this.handleOnBlur}
                onClick={event => {
                    this.click = true;
                }}
                onFocus={event => {
                    handleOnFocus({
                        sectionName,
                        rowId,
                        fieldName: name
                    })
                    // }
                }}
                nextFocus={(event, source, input) => {
                    if (!event.altKey)
                        handleNextField({
                            sectionName,
                            rowId,
                            fieldName: name,
                            source,
                            value: { ...value, text: formatFieldValue(rest.field, value.text) }
                        })
                }}
            />
        );

        const Fragment =(props)=>props.children;
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
                    <InputLableInlineWrapper active={fieldState.active && !_disabled}>
                        <td style={{ width: '25%' }}>
                            {rest.label && (
                                <InputLabel htmlFor={id} ref={this.labelRef} >
                                    {rest.label}
                                </InputLabel>
                            )}

                        </td>
                        <td>
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
                        active={fieldState.active && !_disabled}
                        warning={!Boolean(error) && Boolean(warning)}
                        onClick={event => {
                            if (event.target.tagName !== "INPUT") {
                                handleOnFocus({
                                    sectionName,
                                    rowId,
                                    fieldName: name
                                })
                                this.focus()
                            }
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
    } = ownProps;
    const {
        fields = {},
        current = 0,
        value = {},
        error = {},
        warning = {}
    } = getDataObject('core.resources.form.data', state) || {};
    let fieldState = getDataObject(`${sectionName}.${rowId}.${name}`, fields[current]) || {}
    let valueField = getDataObject(`${sectionName}.${rowId}.${name}`, value) || { text: '', words: [] }
    let errorField = getIn(error, { sectionName, rowId, fieldName: name })
    let warningField = getIn(warning, { sectionName, rowId, fieldName: name })
    return {
        ...ownProps,
        current,
        fieldData: {
            fieldState,
            value: valueField,
            error: errorField,
            warning: warningField,
        }
    }
}
const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    handleChange,
    handleOnBlur,
    handleOnFocus,
    handleNextField,
    handleCoppy,
    handleCoppyShortcut,
    handleFocusShortcut
}, dispatch)

const connector = connect(mapStateToProps, mapDispatchToProps)(ConnectField)
export default connector;


