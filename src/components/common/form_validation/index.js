import React, {
    Component
} from 'react';
import PropTypes from 'prop-types';
import clone from 'clone';
import {
    isEqual,
    cloneDeep,
    sortBy,
} from 'lodash';
import {
    getValidationAndPatternMap,
    getValidationSection
} from './validation';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Conform from './comform_warning'
const tableStyle = {
    recordColumnStyle: { width: 'calc(32px)' },
    fieldColumnStyle: { width: 'calc(26% - 32px)' },
    valueColumnStyle: { width: 'calc(30%)' },
    messageColumnStyle: { width: 'calc(40%)' },
}
const getWaring = (dataWarnings, dataIgnore) => {
    let ignores = clone(dataIgnore);
    let warnings = clone(dataWarnings);
    let recordWarning, recordIgnore;
    Object.keys(ignores).forEach(recordIndex => {
        recordIgnore = ignores[recordIndex];
        recordWarning = warnings[recordIndex];
        if (recordWarning) {
            if (recordIgnore) {
                Object.keys(recordIgnore).forEach(fieldNameIgone => {
                    let fieldWarning = recordWarning[fieldNameIgone];
                    let fieldIgnore = recordIgnore[fieldNameIgone];
                    if (fieldWarning) {
                        if (fieldWarning.value === fieldIgnore.value) {
                            fieldWarning
                                .warnings = fieldWarning
                                    .warnings
                                    .filter(item => {
                                        return fieldIgnore
                                            .warnings
                                            .filter(ignoreWarning =>
                                                isEqual(ignoreWarning, item)
                                            ).length === 0
                                    });
                            if (fieldWarning.warnings.length === 0) {
                                delete recordWarning[fieldNameIgone]
                            }
                        } else {
                            delete recordIgnore[fieldNameIgone];
                        }
                    } else {
                        delete recordIgnore[fieldNameIgone]
                    }
                })
            }
            if (Object.keys(recordWarning).length === 0) {
                delete warnings[recordIndex]
            }
        } else if (recordIgnore) {
            delete ignores[recordIndex]
        }
    })
    return {
        warnings,
        ignores,
    }
}
/**
 * 
 * @param {Object} record 
 * @param {Object} section 
 * @param {Map} fields
 * @description get data of section in record, 
 *  section content field_id but record
 *  store data by field_name so must be match form fields 
 */
const getDataSection = (record, section, fields) => {
    let field, result = {};
    section.fields.forEach(item => {
        /**@description get field form Map<field_id,field> */
        field = fields.get(item.field_id);
        /**@description check field is exist, 
         * may be field has been deleted but section not update list field 
         * and if record has value of field */
        if (field) {
            /**when field not yet entry data then set value empty ''  */
            result[field.name] = record[field.name] || '';
        }
    })
    return result;
}
/**
 * @param {React.Component} ComposeComponent
 * @returns {React.Component} Validation  
 */
export const FormValidation = (ComposeComponent) => {
    return class Validation extends Component {
        static propTypes = {
            recordsInput: PropTypes.arrayOf(PropTypes.object).isRequired,
            fieldsValidation: PropTypes.arrayOf(PropTypes.object).isRequired,
            sectionsValidation: PropTypes.arrayOf(PropTypes.object),
        }
        static defaultProps = {
            recordsInput: [],
            fieldsValidation: [],
            sectionsValidation: [],
        }
        state = {
            errorMap: {},
            warningMap: {},
            sectionErrorMap: new Map(),
            sectionWarningMap: new Map(),
            fieldMap: new Map(),
            warningFull: {},
            ignoreWarningTmp: {},
            ignoreWarning: {},
            openDialogRecord: false,
            func: {},
            openDialog: false,
            funcSection: {},
        }
        componentWillMount() {
            const {
                fieldsValidation,
                recordsInput,
                sectionsValidation
            } = this.props;
            const func = getValidationAndPatternMap(fieldsValidation);
            const funcSection = getValidationSection(sectionsValidation);
            let fieldMap = new Map();
            fieldsValidation.forEach(item => {
                fieldMap.set(item.id, item);
            })
            this.setState({
                fieldMap,
                func: func,
                funcSection,
                recordsInput: recordsInput,
            });
        }
        componentWillReceiveProps(nextProps) {
            /**generate vaildate function of fields   */
            if (!isEqual(this.props.fieldsValidation, nextProps.fieldsValidation)) {
                let fieldMap = new Map();
                nextProps.fieldsValidation.forEach(item => {
                    fieldMap.set(item.id, item);
                })
                this.setState({
                    fieldMap,
                    func: getValidationAndPatternMap(nextProps.fieldsValidation)
                });
            }
            /** generate validate function of sections */
            if (!isEqual(this.props.sectionsValidation, nextProps.sectionsValidation)) {
                this.setState({
                    funcSection: getValidationSection(nextProps.sectionsValidation)
                });
            }
            /**
             * @description check if task has changed then reset state */
            if (nextProps.task && this.props.task) {
                if (!isEqual(nextProps.task.item, this.props.task.item)) {
                    this.setState({
                        sectionErrorMap: new Map(),
                        sectionWarningMap: new Map(),
                        errorMap: {},
                        warningMap: {},
                        warningFull: {},
                        ignoreWarningTmp: {},
                        openDialogRecord: false,
                        ignoreWarning: {},
                        openDialog: false,
                    });
                }
            }
        }
        shouldComponentUpdate(nextProps, nextState, nextContext) {
            let shouldUpdate = (!isEqual(this.props, nextProps) ||
                !isEqual(this.state, nextState) ||
                !isEqual(this.context, nextContext)
            )
            return shouldUpdate;
        }
        componentWillUnmount() {
            this.setState({
                sectionErrorMap: new Map(),
                sectionWarningMap: new Map(),
                errorMap: {},
                warningMap: {},
                warningFull: {},
                ignoreWarningTmp: {},
                ignoreWarning: {},
                func: {},
                openDialog: false,
                funcSection: {},
            })
        }
        __removeError = (rowIndex, fieldName) => {
            let error = cloneDeep(this.state.errorMap);
            if (error[rowIndex]) {
                if (error[rowIndex][fieldName]) {
                    delete error[rowIndex][fieldName];
                    if (Object.keys(error[rowIndex]).length === 0) {
                        delete error[rowIndex]
                    }
                    this.setState({
                        errorMap: error
                    })
                }
            }
        }
        resetValidation = () => {
            this.setState({
                errorMap: {},
                warningMap: {},
                ignoreWarning: {}
            })
            return true;
        }
        getDisplayByName = (name) => {
            const { fieldsValidation } = this.props;
            let field = fieldsValidation.filter(item => item.name === name)[0];
            if (field) {
                return field.field_display
            }
            return name
        }
        switchRecord = (index, isUp) => {
            const { recordsInput } = this.props;
            const {
                warningFull,
                ignoreWarning,
                errorMap
            } = this.state;
            try {
                let indexSwitch;
                let warningFullNew = clone(warningFull);
                let ignoreWarningNew = clone(ignoreWarning);
                let errorMapNew = clone(errorMap);
                if (isUp) {
                    indexSwitch = index - 1
                    indexSwitch = indexSwitch >= 0 ? indexSwitch : recordsInput.length - 1;
                } else {
                    indexSwitch = index + 1
                    indexSwitch = indexSwitch <= recordsInput.length - 1 ? indexSwitch : 0
                }
                let tmp;
                tmp = warningFullNew[index];
                warningFullNew[index] = warningFullNew[indexSwitch]
                warningFullNew[indexSwitch] = tmp
                if (!warningFullNew[index]) delete warningFullNew[index]
                if (!warningFullNew[indexSwitch]) delete warningFullNew[indexSwitch]

                tmp = ignoreWarningNew[index];
                ignoreWarningNew[index] = ignoreWarningNew[indexSwitch]
                ignoreWarningNew[indexSwitch] = tmp
                if (!ignoreWarningNew[index]) delete ignoreWarningNew[index]
                if (!ignoreWarningNew[indexSwitch]) delete ignoreWarningNew[indexSwitch]

                tmp = errorMapNew[index];
                errorMapNew[index] = warningFullNew[indexSwitch]
                errorMapNew[indexSwitch] = tmp
                if (!errorMapNew[index]) delete errorMapNew[index]
                if (!errorMapNew[indexSwitch]) delete errorMapNew[indexSwitch]
                this.setState({
                    warningFull: warningFullNew,
                    errorMap: errorMapNew,
                    ignoreWarning: ignoreWarningNew
                })
            } catch (e) {

            }
        }
        insertRecordValidate = (index) => {
            const {
                warningFull,
                ignoreWarning,
                errorMap
            } = this.state;
            try {
                let warningFullNew = clone(warningFull);
                let ignoreWarningNew = clone(ignoreWarning);
                let errorMapNew = clone(errorMap);
                let indexRecordWarning = Object.keys(warningFull).filter(indexWaring => {
                    return indexWaring >= index
                })
                let indexIgnoreWarning = Object.keys(ignoreWarning).filter(indexItem => {
                    return indexItem >= index
                })
                let indexErrorMap = Object.keys(errorMap).filter(indexItem => {
                    return indexItem >= index
                })
                if (indexRecordWarning.length) {
                    indexRecordWarning.forEach(itemIndex => {
                        warningFullNew[itemIndex + 1] = clone(warningFullNew[itemIndex])
                    })
                }
                delete warningFullNew[index]
                if (indexIgnoreWarning.length) {
                    indexIgnoreWarning.forEach(itemIndex => {
                        ignoreWarningNew[itemIndex + 1] = clone(ignoreWarningNew[itemIndex])
                    })
                }
                delete ignoreWarningNew[index]
                if (indexErrorMap.length) {
                    indexErrorMap.forEach(itemIndex => {
                        errorMapNew[itemIndex + 1] = clone(errorMapNew[itemIndex])
                    })
                }
                delete errorMapNew[index]
                this.setState({
                    warningFull: warningFullNew,
                    errorMap: errorMapNew,
                    ignoreWarning: ignoreWarningNew
                })
            } catch (e) {

            }

        }
        removeRecordValidate = (index) => {
            const {
                warningFull,
                ignoreWarning,
                errorMap,
                sectionErrorMap,
            } = this.state;
            try {
                let sectionErrorMapNew = new Map(sectionErrorMap);
                let warningFullNew = clone(warningFull);
                let ignoreWarningNew = clone(ignoreWarning);
                let errorMapNew = clone(errorMap);

                if (sectionErrorMapNew.has(index)) {
                    sectionErrorMapNew.delete(index);
                }

                let indexRecordWarning = Object.keys(warningFull).filter(indexWaring => {
                    return indexWaring > index
                })
                let indexIgnoreWarning = Object.keys(ignoreWarning).filter(indexItem => {
                    return indexItem > index
                })
                let indexErrorMap = Object.keys(errorMap).filter(indexItem => {
                    return indexItem > index
                })
                if (indexRecordWarning.length) {
                    indexRecordWarning.forEach(itemIndex => {
                        warningFullNew[itemIndex - 1] = clone(warningFullNew[itemIndex])
                    })
                }
                delete warningFullNew[indexRecordWarning.pop()]
                if (indexIgnoreWarning.length) {
                    indexIgnoreWarning.forEach(itemIndex => {
                        ignoreWarningNew[itemIndex - 1] = clone(ignoreWarningNew[itemIndex])
                    })
                }
                delete ignoreWarningNew[indexIgnoreWarning.pop()]
                if (indexErrorMap.length) {
                    indexErrorMap.forEach(itemIndex => {
                        errorMapNew[itemIndex - 1] = clone(errorMapNew[itemIndex])
                    })
                }
                delete errorMapNew[indexErrorMap.pop()]
                this.setState({
                    warningFull: warningFullNew,
                    errorMap: errorMapNew,
                    ignoreWarning: ignoreWarningNew,
                    sectionErrorMap: sectionErrorMapNew
                })
            } catch (e) {
            }
        }
        checkValidationRecord = (recordIndex, callback) => {
            const {
                fieldsValidation,
                recordsInput
            } = this.props;
            const {
                func,
                warningFull,
                ignoreWarning
            } = this.state;
            let error,
                warning = clone(warningFull),
                fieldName,
                funVali,
                valueField,
                errorPattern,
                errorValidate;
            let record = recordsInput[recordIndex];
            fieldsValidation.forEach(field => {
                fieldName = field.name;
                valueField = record[fieldName] || '';
                funVali = func[fieldName];
                if (funVali) {
                    try {
                        errorPattern = funVali.checkPattern(valueField);
                        errorValidate = funVali.checkValidate(valueField, record);
                        if (errorPattern) {
                            error = error || {};
                            error[recordIndex] = error[recordIndex] || {};
                            error[recordIndex][fieldName] = {
                                errorPattern
                            }
                        }
                        if (errorValidate && Array.isArray(errorValidate)) {
                            let errorField = [];
                            let warningField = [];
                            errorValidate.forEach(mss => {
                                if (mss.type === 'error') {
                                    errorField.push(mss);
                                } else {
                                    warningField.push(mss);
                                }
                            })
                            if (errorField.length) {
                                error = error || {};
                                error[recordIndex] = error[recordIndex] || {};
                                error[recordIndex][fieldName] = {
                                    errorValidate: errorField
                                }
                            }
                            if (warningField.length) {
                                warning = warning || {};
                                warning[recordIndex] = warning[recordIndex] || {};
                                warning[recordIndex][fieldName] = {
                                    warnings: warningField,
                                    value: valueField
                                }
                            }
                        }
                    } catch (error) {

                    }
                }
            })
            if (warning) {
                let {
                    warnings,
                    ignores,
                } = getWaring(warning, ignoreWarning)
                this.setState({
                    errorMap: error || {},
                    ignoreWarning: ignores,
                    warningMap: warnings || {},
                    warningFull: warning
                }, () => {
                    callback && callback(this.state)
                });
                return {
                    errorMap: error,
                    warningMap: Object.keys(warnings).length ? warnings : undefined
                }
            } else {
                this.setState({
                    errorMap: error || {},
                    ignoreWarning: {},
                    warningMap: {}
                }, () => {
                    callback && callback(this.state)
                });
                return {
                    errorMap: error
                };
            }
        }
        checkValidationSectionRecord = (recordIndex, section_name, callback) => {
            const { props, state } = this;
            const { recordsInput, sectionsValidation } = props;
            const { sectionErrorMap, funcSection, fieldMap } = state;
            let record = recordsInput[recordIndex],
                sectionErrorMapNew = new Map(sectionErrorMap),
                errorValidate,
                sectionDataTyping,
                section = sectionsValidation.filter(item => item.name === section_name)[0],
                funVali = funcSection[section_name];
            if (funVali) {
                try {
                    sectionDataTyping = getDataSection(record, section, fieldMap);
                    errorValidate = funVali.checkValidate(sectionDataTyping, record);
                    if (errorValidate && Array.isArray(errorValidate)) {
                        let errorsOfSection = [];
                        let warningOfSection = [];
                        errorValidate.forEach(mss => {
                            if (mss.type === 'error') {
                                errorsOfSection.push(mss.message);
                            } else {
                                warningOfSection.push(mss.message);
                            }
                        })
                        let error = new Map();
                        if (errorsOfSection.length) {
                            error.set('error', errorsOfSection)
                        }
                        if (warningOfSection.length) {
                            error.set('warning', warningOfSection)
                        }
                        if (sectionErrorMapNew.has(recordIndex)) {
                            let msOfrecord = sectionErrorMapNew.get(recordIndex);
                            msOfrecord.set(section_name, error)
                        } else {
                            let msOfrecord = new Map();
                            msOfrecord.set(section_name, error)
                            sectionErrorMapNew.set(recordIndex, msOfrecord)
                        }
                    } else {
                        if (sectionErrorMapNew.has(recordIndex)) {
                            let msOfrecord = sectionErrorMapNew.get(recordIndex);
                            if (msOfrecord.has(section_name)) {
                                msOfrecord.delete(section_name)
                            }
                        }
                    }
                    return sectionErrorMapNew;
                    this.setState({ sectionErrorMap: sectionErrorMapNew }, //eslint-disable-line
                        (state) => {
                            callback(sectionErrorMapNew, state)
                        })
                } catch (error) {
                    return sectionErrorMapNew;
                }
            } else {
                return sectionErrorMapNew;
            }
        }

        checkValidationForm = () => {
            const {
                fieldsValidation,
                recordsInput
            } = this.props;
            const {
                func,
                ignoreWarning
            } = this.state;
            let error,
                warning,
                fieldName,
                funVali,
                valueField,
                errorPattern,
                errorValidate;
            recordsInput.forEach((record, recordIndex) => {
                fieldsValidation.forEach(field => {
                    fieldName = field.name;
                    valueField = record[fieldName] || '';
                    funVali = func[fieldName];
                    if (funVali) {
                        try {
                            errorPattern = funVali.checkPattern(valueField);
                            errorValidate = funVali.checkValidate(valueField, record);
                            if (errorPattern) {
                                error = error || {};
                                error[recordIndex] = error[recordIndex] || {};
                                error[recordIndex][fieldName] = {
                                    errorPattern
                                }
                            }
                            if (errorValidate && Array.isArray(errorValidate)) {
                                let errorField = [];
                                let warningField = [];
                                errorValidate.forEach(mss => {
                                    if (mss.type === 'error') {
                                        errorField.push(mss);
                                    } else {
                                        warningField.push(mss);
                                    }
                                })
                                if (errorField.length) {
                                    error = error || {};
                                    error[recordIndex] = error[recordIndex] || {};
                                    error[recordIndex][fieldName] = {
                                        errorValidate: errorField
                                    }
                                }
                                if (warningField.length) {
                                    warning = warning || {};
                                    warning[recordIndex] = warning[recordIndex] || {};
                                    warning[recordIndex][fieldName] = {
                                        warnings: warningField,
                                        value: valueField
                                    }
                                }
                            }
                        } catch (error) {

                        }
                    }
                })
            });
            if (warning) {
                let {
                    warnings,
                    ignores,
                } = getWaring(warning, ignoreWarning)
                this.setState({
                    errorMap: error || {},
                    ignoreWarning: ignores,
                    warningMap: warnings || {},
                    warningFull: warning
                });
                return {
                    errorMap: error,
                    warningMap: Object.keys(warnings).length ? warnings : undefined
                }
            } else {
                this.setState({
                    errorMap: error || {},
                    ignoreWarning: {},
                    warningMap: {}
                });
                return {
                    errorMap: error
                };
            }
        }
        checkConformWarning = (callback) => {
            this.callback = callback;
            this.openDialog()
        }
        checkConformWarningRecord = (indexRecord, callback) => {
            this.indexRecordcallback = callback;
            this.indexRecord = indexRecord;
            this.setState({
                openDialogRecord: true,
                indexRecord: indexRecord,
                ignoreWarningTmp: clone(this.state.ignoreWarning)
            })
        }

        closeDialogRecord = (warningArray) => {
            const self = this;
            let ignoreMap = clone(this.state.ignoreWarning);
            warningArray.forEach(item => {
                if (item.ignore) {
                    ignoreMap[this.state.indexRecord] = ignoreMap[this.state.indexRecord] || {};
                    ignoreMap[this.state.indexRecord][item.fieldName] = ignoreMap[this.state.indexRecord][item.fieldName] || {
                        value: item.value,
                        warnings: []
                    }
                    ignoreMap[this.state.indexRecord][item.fieldName].warnings.push(item.message);
                }
            })
            let {
                warnings,
            } = getWaring(this.state.warningMap, ignoreMap)

            this.setState({
                ignoreWarning: ignoreMap,
                warningMap: warnings || {},
                openDialogRecord: false
            }, () => {
                self.indexRecordcallback(self.state)
            })
        }
        openDialog = () => {
            this.setState({
                openDialog: true,
                ignoreWarningTmp: clone(this.state.ignoreWarning)
            })
        }

        closeDialog = () => {
            const self = this;
            this.selectedRows = null;
            this.warningArray = [];
            this.setState({
                openDialog: false
            }, () => {
                self.callback(self.state.warningMap)
            })
        }
        handleIgnore = () => {
            const self = this;
            let {
                warnings,
                ignores
            } = getWaring(this.state.warningFull, this.state.ignoreWarningTmp)
            this.setState({
                ignoreWarning: ignores,
                warningMap: warnings || {},
                openDialog: false,
            }, () => {
                self.callback(warnings)
            });
        }
        handleCheckValidation = (name, val, row = 0) => {
            const {
                recordsInput
            } = this.props;
            const record = recordsInput[row];
            const {
                func
            } = this.state;
            let funVali = func[name];
            if (funVali) {
                let error = cloneDeep(this.state.errorMap);
                let errorValidate = funVali.checkValidate(val, record);
                if (errorValidate && Array.isArray(errorValidate)) {
                    error[row] = error[row] || {};
                    error[row][name] = {
                        errorValidate,
                    }
                    this.setState({
                        errorMap: error
                    })
                } else {
                    this.__removeError(row, name)
                }
            }
        }
        handleCheckPattern = (name, val, row = 0) => {
            const {
                func
            } = this.state;
            let funVali = func[name];
            if (funVali) {
                let error = cloneDeep(this.state.errorMap);
                let errorPattern = funVali.checkPattern(val);
                if (errorPattern) {
                    error[row] = error[row] || {};
                    error[row][name] = {
                        errorPattern,
                    }
                    this.setState({
                        errorMap: error
                    })
                } else {
                    this.__removeError(row, name)
                }
            }
        }

        handleCheckVailidationAndPattern = (fieldName, valueField, recordIndex = 0) => {
            const { recordsInput } = this.props;
            const record = recordsInput[recordIndex];
            const {
                func,
                errorMap,
                warningFull,
                ignoreWarning
            } = this.state;
            let error = clone(errorMap),
                warning = clone(warningFull),
                errorPattern, errorValidate;
            let funVali = func[fieldName];
            if (funVali) {
                errorPattern = funVali.checkPattern(valueField);
                errorValidate = funVali.checkValidate(valueField, record);
                if (errorPattern) {
                    error = error || {};
                    error[recordIndex] = error[recordIndex] || {};
                    error[recordIndex][fieldName] = {
                        errorPattern
                    }
                } else {
                    if (error[recordIndex] && error[recordIndex][fieldName] && error[recordIndex][fieldName].errorPattern) {
                        delete error[recordIndex][fieldName].errorPattern;
                    }
                }
                if (errorValidate && Array.isArray(errorValidate)) {
                    let errorField = [];
                    let warningField = [];
                    errorValidate.forEach(mss => {
                        if (mss.type === 'error') {
                            errorField.push(mss);
                        } else {
                            warningField.push(mss);
                        }
                    })
                    if (errorField.length) {
                        error = error || {};
                        error[recordIndex] = error[recordIndex] || {};
                        error[recordIndex][fieldName] = {
                            errorValidate: errorField
                        }
                    }
                    if (warningField.length) {
                        warning = warning || {};
                        warning[recordIndex] = warning[recordIndex] || {};
                        warning[recordIndex][fieldName] = {
                            warnings: warningField,
                            value: valueField
                        }
                    }
                } else {
                    if (error[recordIndex] && error[recordIndex][fieldName] && error[recordIndex][fieldName].errorValidate) {
                        delete error[recordIndex][fieldName].errorValidate;
                    }
                    if (warning[recordIndex] && warning[recordIndex][fieldName]) {
                        delete warning[recordIndex][fieldName];
                    }
                }
                Object.keys(error).forEach(checkIndex => {
                    let errorRecord = error[checkIndex];
                    Object.keys(errorRecord).forEach(fieldNameCheck => {
                        let fieldCheck = errorRecord[fieldNameCheck];
                        if (!fieldCheck || Object.keys(fieldCheck).length === 0) {
                            delete errorRecord[fieldNameCheck]
                        }
                    })
                    if (Object.keys(errorRecord).length === 0) {
                        delete error[checkIndex]
                    }
                })
                if (Object.keys(error).length === 0) {
                    error = null;
                }
                Object.keys(warning).forEach(checkIndex => {
                    let errorRecord = warning[checkIndex];
                    Object.keys(errorRecord).forEach(fieldNameCheck => {
                        let fieldCheck = errorRecord[fieldNameCheck];

                        if (!fieldCheck || Object.keys(fieldCheck).length === 0) {
                            delete errorRecord[fieldNameCheck]
                        }
                    })
                    if (Object.keys(errorRecord).length === 0) {
                        delete warning[checkIndex]
                    }
                })
                if (Object.keys(warning).length === 0) {
                    warning = null;
                }
            }
            if (warning) {
                let {
                    warnings,
                    ignores,
                } = getWaring(warning, ignoreWarning)
                this.setState({
                    errorMap: error || {},
                    ignoreWarning: ignores,
                    warningMap: warnings || {},
                    warningFull: warning
                });
                return {
                    errorMap: error,
                    warningMap: Object.keys(warnings).length ? warnings : undefined
                }
            } else {
                this.setState({
                    errorMap: error || {},
                    ignoreWarning: {},
                    warningMap: {},
                    warningFull: {}
                });
                return {
                    errorMap: error
                };
            }
        }
        isIgnore = (recordIndex, fieldName, message) => {
            let ignoreMap = this.state.ignoreWarningTmp;
            if (ignoreMap[recordIndex] && ignoreMap[recordIndex][fieldName]) {
                if (ignoreMap[recordIndex][fieldName].warnings.filter(item => item.message === message).length) {
                    return true;
                }
            }
            return false;
        }
        getBodyComform = () => {
            const self = this;
            let result = [];
            if (this.state.openDialog) {
                self.warningArray = [];
                Object.keys(this.state.warningFull).sort().forEach(recordIndex => {
                    let recordData = this.state.warningFull[recordIndex]
                    Object.keys(recordData).sort().forEach(fieldName => {
                        let warningField = recordData[fieldName];
                        warningField.warnings.forEach(mss => {
                            self.warningArray.push({
                                recordIndex,
                                fieldName,
                                value: warningField.value,
                                message: mss
                            })
                        })

                    })
                });
                self.warningArray = sortBy(self.warningArray, ['recordIndex'])
                self.warningArray.forEach(item => {
                    result.push(
                        <TableRow key={`item-warning-${item.recordIndex}-${item.fieldName}-${item.value}-${item.message.message}`}
                            selected={this.isIgnore(item.recordIndex, item.fieldName, item.message.message)}
                        >
                            <TableRowColumn style={tableStyle.recordColumnStyle} > {parseInt(item.recordIndex, 10) + 1}</TableRowColumn>
                            <TableRowColumn style={tableStyle.fieldColumnStyle}>{self.getDisplayByName(item.fieldName)}</TableRowColumn>
                            <TableRowColumn style={tableStyle.valueColumnStyle}>{item.value}</TableRowColumn>
                            <TableRowColumn style={tableStyle.messageColumnStyle}>{item.message.message}</TableRowColumn>
                        </TableRow>
                    )
                })

            }
            return result;
        }
        handleRowSelection = (selectedRows) => {
            let seleted = [];
            let ignoreMap = {};
            if (typeof selectedRows === 'string') {
                if (selectedRows === 'all') {
                    seleted = this.warningArray
                }
            } else {
                seleted = selectedRows.map(i => this.warningArray[i])
            }
            seleted.forEach(item => {
                ignoreMap[item.recordIndex] = ignoreMap[item.recordIndex] || {};
                ignoreMap[item.recordIndex][item.fieldName] = ignoreMap[item.recordIndex][item.fieldName] || {
                    value: item.value,
                    warnings: []
                }
                ignoreMap[item.recordIndex][item.fieldName].warnings.push(item.message);
            })
            this.setState({
                ignoreWarningTmp: ignoreMap
            })
        }
        render() {

            return [<ComposeComponent {...this.props}
                key={
                    'sub-component'
                }
                valitionForm={
                    this
                }
                switchRecord={this.switchRecord}
                checkValidationRecord={this.checkValidationRecord}
                errorMap={
                    this.state.errorMap
                }
                checkValidationSectionRecord={this.checkValidationSectionRecord}
                insertRecordValidate={this.insertRecordValidate}
                removeRecordValidate={this.removeRecordValidate}
                warningMap={
                    this.state.warningFull
                }
                ignoreWarning={
                    this.state.ignoreWarning
                }
                checkValidationForm={
                    this.checkValidationForm
                }
                checkPattern={
                    this.handleCheckPattern
                }
                checkValidation={
                    this.handleCheckValidation
                }
                checkConformWarning={
                    this.checkConformWarning
                }
                checkConformWarningRecord={
                    this.checkConformWarningRecord
                }
                checkValidationAndPattern={
                    this.handleCheckVailidationAndPattern
                }
            />,
            <Dialog
                key={
                    'dialog-component'
                }
                title="WARNING"
                actions={
                    [<FlatButton
                        label="CLOSE"
                        onClick={
                            this.closeDialog
                        } />, <FlatButton
                        disabled={Object.keys(this.state.ignoreWarningTmp).length === 0}
                        label="IGNORE"
                        primary={
                            true
                        }
                        keyboardFocused={
                            true
                        }
                        onClick={
                            this.handleIgnore
                        }
                    />,
                    ]
                }
                contentStyle={{ width: 'calc(80%)', maxWidth: '1200px' }}
                modal={
                    false
                }
                open={
                    this.state.openDialog
                }
                onRequestClose={
                    this.closeDialog
                } >
                <Table multiSelectable={
                    true
                }
                    selectable={
                        true
                    }
                    height="369px"
                    bodyStyle={{ backgroundColor: "#FFFFFF" }}
                    fixedHeader={true}
                    onRowSelection={this.handleRowSelection}>
                    <TableHeader enableSelectAll={true} >
                        <TableRow>
                            <TableHeaderColumn style={tableStyle.recordColumnStyle}>Record</TableHeaderColumn>
                            <TableHeaderColumn style={tableStyle.fieldColumnStyle}>Field</TableHeaderColumn>
                            <TableHeaderColumn style={tableStyle.valueColumnStyle}>Value</TableHeaderColumn>
                            <TableHeaderColumn style={tableStyle.messageColumnStyle}>Message</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {this.getBodyComform()}
                    </TableBody>
                </Table>
            </Dialog>
                ,
            <Conform key={'dialog-conform-single-record'} closeDialog={this.closeDialogRecord}
                open={this.state.openDialogRecord}
                warningMap={this.state.warningMap}
                indexRecord={this.state.indexRecord}
                fieldsValidation={this.props.fieldsValidation}
            />
            ];
        }
    }
}
export default FormValidation;