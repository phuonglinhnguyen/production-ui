// @flow strict
import * as React from 'react';
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux';
import { getDataObject } from '@dgtx/coreui';
import { bindActionCreators } from 'redux';
// import { handleChange, handleOnBlur, handleOnFocus, handleNextField } from './actions'
import { isEqual } from 'lodash'
import { getIn, removeWordInFieldValue, formatFieldValue } from './utils'
import { debounce } from '../../utils/common'

type Props = {||};




export const createConnectField = (Target) => {
    class ConnectField extends React.Component<Props> {
        constructor(props: Props) {
            super(props);
            this.handleChange = debounce(this.handleChange, 150);
        }
        componentWillMount() {
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
        }

        componentWillReceiveProps(nextProps: Props) {

        }

        shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {
            return !isEqual(this.props.fieldData, nextProps.fieldData)
                || this.props.disabled !== nextProps.disabled

        }

        componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {
        }

        handleChange = (data) => {
            const { handleChange, fieldData: { value } } = this.props;
            data.value = removeWordInFieldValue(value, data.value)
            handleChange && handleChange(data)
        }

        componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {
            const {
                content,
                fieldData: { fieldState } } = this.props;
            if (fieldState.active) {
                this.setFocus = true;
                this.refs.input.focus(!prevProps.fieldData.fieldState.active, findDOMNode(content.refs.content))
            } else if (prevProps.fieldData.fieldState.active) {
                this.setBlur = true;
            }
        }
        componentWillUnmount() {
        }

        render() {
            const {
                name,
                rowId,
                content,
                autoScroll,
                sectionName,
                handleChange,
                handleOnBlur,
                handleOnFocus,
                handleNextField,
                fieldData: {
                    value,
                    fieldState,
                    error,
                    warning
                },
                disabled,
                multiLine,
                ...rest } = this.props;
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
            let _disabled = disabled || fieldState.disabled;
            return (
                <Target {...rest}
                    ref='input'
                    disabled={_disabled}
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
                    onUpdateInput={data =>
                        this.handleChange({
                            value: { ...value, text: data },
                            sectionName,
                            rowId,
                            fieldName: name
                        })}
                    onBlur={event => {
                        if (this.setBlur) {
                            this.setBlur = false;
                        } else {
                            this.handleChange.flush();
                            handleOnBlur({
                                sectionName,
                                rowId,
                                fieldName: name,
                                value: { ...value, text: formatFieldValue(rest.field, value.text) },
                            })
                        }
                    }}
                    onFocus={event => {
                        if (this.setFocus) {
                            this.setFocus = false;
                        } else {
                            handleOnFocus({
                                sectionName,
                                rowId,
                                fieldName: name
                            })
                        }
                    }}
                    nextFocus={(event, source, input) => handleNextField({
                        sectionName,
                        rowId,
                        fieldName: name,
                        source,
                        value:{...value, text: formatFieldValue(rest.field, value.text) }
                    })}
                />
            );
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
            fieldData: {
                fieldState,
                value: valueField,
                error: errorField,
                warning: warningField,
            }
        }
    }
    const mapDispatchToProps = (dispatch: any) =>{}; //bindActionCreators({ handleChange, handleOnBlur, handleOnFocus, handleNextField }, dispatch)

    const connector = connect(mapStateToProps, mapDispatchToProps)(ConnectField)
    return connector;
}


