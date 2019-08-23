import clone from 'clone'
import { isEqual } from 'lodash'
import {
    SET_SECTION_FORM,
    CLEAR_DATA,
    ADD_RECORD_SECTION,
    REMOVE_RECORD_SECTION,
    SWITCH_RECORD_SECTION,
    LOAD_DATA_FROM,
    ADD_RECORD,
    REMOVE_RECORD,
    CHANGE_STATE_FROM,
    IGNORE_WARNING_FROM,
    FORCUS_FIRST_FROM,
    UPDATE_CURRENT_DATA_FROM,
    CHANGE_DATA_FIELD_FROM,
    ON_FOCUS_FIELD_FROM,
    ON_BLUR_FIELD_FROM,
    SHOW_WARNING_FROM,
    HIDE_WARNING_FROM,
    ON_NEXT_FIELD,
    SET_VALIDATION_FIELD,
    SET_VALIDATION_FIELD_VALUE,
    CHANGE_NEXT_FROM,
    FOCUS_FIELD_ERROR_FROM,
    CHANGING_DATA_FIELD_FROM,
    INIT_FIELD_ELEMENT_DATA_FROM,
    SET_VALIDATION_LAYOUT,
    SET_VALIDATION_LAYOUT_VALUE,
    SET_DISABLE_FIELD,
} from './actions'
// import { getFieldRecord } from './handlers';
import { setIn, getIn, delectIn } from './utils'
import { getFieldRecord } from './handlers/behavior';
const handleAddRecordSection = (state, { sectionName, rowId }) => {
    let fields = clone(state.fields)
    let _rowId
    if (typeof rowId === "number") {
        _rowId = rowId;
    } else {
        _rowId = state.active ? state.active.rowId + 1 : 0;
    }
    let value = clone(state.value);
    let error = clone(state.error)
    let warning = clone(state.warning)
    let nextRecord = getFieldRecord(state.sections)[sectionName][0]
    // let nextRecord = clone(fields[state.current][sectionName][0])
    // Object.keys(nextRecord).forEach(key => {
    //     nextRecord[nextRecord] = { ...nextRecord[nextRecord], touched: false, active: false }
    // })
    if (value[sectionName]) {
        value[sectionName].splice(_rowId, 0, {})
    }
    if (error[sectionName]) {
        error[sectionName].splice(_rowId, 0, {})
    }
    if (warning[sectionName]) {
        warning[sectionName].splice(_rowId, 0, {})
    }
    if (state.active) {
        fields[state.current][sectionName].splice(_rowId, 0, nextRecord)
    } else {
        fields[state.current][sectionName].splice(_rowId, 0, nextRecord)
    }
    return {
        ...state,
        active: { ...state.active, rowId: _rowId },
        fields,
        value,
        warning,
        error,
    }
}
const handleRemoveRecordSection = (state, { sectionName, rowId }) => {
    let fields = clone(state.fields)
    let error = clone(state.error)
    let warning = clone(state.warning)
    let _rowId
    if (typeof rowId === "number") {
        _rowId = rowId;
    } else {
        _rowId = state.active && state.active.rowId || fields[state.current][sectionName].length - 1;
    }
    if (error[sectionName]) {
        error[sectionName].splice(_rowId, 1)
    }
    if (warning[sectionName]) {
        warning[sectionName].splice(_rowId, 1)
    }
    let value = clone(state.value)

    if (value[sectionName] && value[sectionName].length) {
        if (value[sectionName]) {
            value[sectionName].splice(_rowId, 1)
        }
        if (!value[sectionName].length) {
            value[sectionName] = [{}]
        }
    }
    if (fields[state.current][sectionName].length > 1) {
        fields[state.current][sectionName].splice(_rowId, 1)
    }
    if (state.active && state.active.sectionName === sectionName) {
        let _active = { ...state.active }
        let __rowId = _active.rowId;
        if (!fields[state.current][sectionName][__rowId]) {
            __rowId -= 1;
        }
        if (__rowId > -1) {
            setIn(fields[state.current], { ...state.active, rowId: __rowId, key: 'active' }, true)
            return {
                ...state,
                active: { ..._active, rowId: __rowId },
                fields,
                value
            }
        } else {
            return {
                ...state,
                active: null,
                fields,
                value
            }
        }
    }
    return {
        ...state,
        fields,
        error,
        warning,
        value
    }
}
const handleSwitchRecordSection = (state, { sectionName, rowId, direction }) => {
    let values = clone(state.values)
    let dataRecord = values[state.current]
    let fields = clone(state.fields)
    let fieldCurrent = fields[state.current]
    if (direction === 'up' && rowId > 0) {
        let tmp = dataRecord[sectionName][rowId]
        dataRecord[sectionName][rowId] = dataRecord[sectionName][rowId - 1]
        dataRecord[sectionName][rowId - 1] = tmp
        let tmpf = fieldCurrent[sectionName][rowId]
        fieldCurrent[sectionName][rowId] = fieldCurrent[sectionName][rowId - 1]
        fieldCurrent[sectionName][rowId - 1] = tmpf
    } else if (rowId < fieldCurrent[sectionName].length) {
        let tmp = dataRecord[sectionName][rowId]
        dataRecord[sectionName][rowId] = dataRecord[sectionName][rowId + 1]
        dataRecord[sectionName][rowId + 1] = tmp
        let tmpf = fieldCurrent[sectionName][rowId]
        fieldCurrent[sectionName][rowId] = fieldCurrent[sectionName][rowId + 1]
        fieldCurrent[sectionName][rowId + 1] = tmpf
    }
    return {
        ...state,
        values,
        fields,
    }
}

const handleLoadData = (state, initData) => {
    if (typeof initData === 'function') {
        if (state.sections && state.sections.length > 0) {
            let nextData = initData(state)
            return {
                ...state,
                valuesInited: initData,
                ...nextData
            }
        } else {
            return {
                ...state,
                valuesInit: initData,
            }
        }
    } else {
        return {
            ...state,
            ...initData,
        }
    }
}


const handleClean = (state, payload) => {
    let next = {
        current: 0,
        value: {},
        field: {},
        error: {},
        elements: state.elements,
        warning: {},
        values: [{}],
        errors: [{}],
        validating: false,
        warningSections: {},
        validationSections: {},
        warnings: [{}],
        recordsTouched: { 0: true },
        focusSubmit: false,
    }
    return {
        ...next,
        ...payload,
    }
    // return handleSetSections(next, { sections: state.sections })
}
export default {
    name: 'form',
    reducer: (state = {
        value: {},
        field: {},
        error: {},
        warning: {},
        layout: {},
        sections: [],
        current: 0,
        fields: [],
        values: [{}],
        validationSections: {},
        recordsTouched: { 0: true },
        errors: [{}],
        warnings: [{}],
        warningSections: {},
        focusSubmit: false,
        showWarning: false,
        showWarnings: false,
        elements: {},
        active: null,
        validating: false
    }, { type, payload, meta }) => {
        switch (type) {
            case SET_VALIDATION_LAYOUT: {
                return {
                    ...state,
                    validating: payload
                }
            }
            case CLEAR_DATA: {
                return handleClean(state, payload);
            }
            case SHOW_WARNING_FROM: {
                return {
                    ...state,
                    showWarning: true,
                    showWarnings: payload,
                }
            }
            case HIDE_WARNING_FROM: {
                return {
                    ...state,
                    showWarning: false,
                    showWarningSection: false,
                    showWarnings: false,
                }
            }
            case INIT_FIELD_ELEMENT_DATA_FROM: {
                const elements = state.elements;
                elements[payload.fieldName] = payload.element;
                return {
                    ...state,
                    elements
                }
            }

            case SET_VALIDATION_FIELD: {
                let fields = clone(state.fields);
                const { sectionName, rowId, fieldName, validating } = payload
                setIn(fields[state.current], { sectionName, rowId, fieldName, key: 'validating' }, validating)
                return {
                    ...state,
                    fields
                }
            }
            case SET_VALIDATION_LAYOUT_VALUE: {
                let fields = clone(state.fields);
                let _warning = clone(state.warning);
                let _error = clone(state.error);
                payload.forEach(ele => {
                    setIn(fields[state.current], { ...ele.field, key: 'touched' }, ele.touched);
                    if (ele.error) {
                        setIn(_error, ele.field, ele.error)
                        if (getIn(_warning, ele.field)) {
                            delectIn(_warning, ele.field)
                        }
                    } else if (ele.warning) {
                        let _w_current = getIn(_warning, ele.field)
                        if (!(_w_current && _w_current.ignore && isEqual(_w_current.datas, ele.warning.datas))) {
                            setIn(_warning, ele.field, ele.warning)
                            if (getIn(state.error, ele.field)) {
                                delectIn(_error, ele.field)
                            }
                        }
                    }
                });
                return {
                    ...state,
                    fields,
                    error: _error,
                    warning: _warning
                }
            }
            case SET_VALIDATION_FIELD_VALUE: {
                const { sectionName,
                    rowId,
                    fieldName,
                    touched,
                    warning, error } = payload;
                let fields = clone(state.fields)
                setIn(fields[state.current], { sectionName, rowId, fieldName, key: 'touched' }, touched)
                if (error && error.length) {
                    let _error = clone(state.error);
                    setIn(_error, { sectionName, rowId, fieldName }, error)
                    if (getIn(state.warning, { sectionName, rowId, fieldName })) {
                        let _warning = clone(state.warning);
                        delectIn(_warning, { sectionName, rowId, fieldName })
                        return {
                            ...state,
                            fields,
                            error: _error,
                            warning: _warning
                        }
                    }
                    return {
                        ...state,
                        fields,
                        error: _error
                    }
                } else if (warning) {
                    let _warning = clone(state.warning);
                    let _w_current = getIn(_warning, { sectionName, rowId, fieldName })
                    if (!(_w_current && _w_current.ignore && isEqual(_w_current.datas, warning.datas))) {
                        setIn(_warning, { sectionName, rowId, fieldName }, warning)
                        if (getIn(state.error, { sectionName, rowId, fieldName })) {
                            let _error = clone(state.error);
                            delectIn(_error, { sectionName, rowId, fieldName })
                            return {
                                ...state,
                                fields,
                                error: _error,
                                warning: _warning
                            }
                        } else {
                            return {
                                ...state,
                                fields,
                                warning: _warning
                            }
                        }
                    }
                } else if (getIn(state.warning, { sectionName, rowId, fieldName })) {
                    let _warning = clone(state.warning);
                    delectIn(_warning, { sectionName, rowId, fieldName })
                    return {
                        ...state,
                        fields,
                        warning: _warning
                    }
                } else if (getIn(state.error, { sectionName, rowId, fieldName })) {
                    let _error = clone(state.error);
                    delectIn(_error, { sectionName, rowId, fieldName })
                    return {
                        ...state,
                        fields,
                        error: _error
                    }
                }
                return { ...state, fields };
            }
            case CHANGING_DATA_FIELD_FROM: {
                let fields = clone(state.fields);
                const { sectionName, rowId, fieldName, value } = payload
                setIn(fields[state.current], { sectionName, rowId, fieldName, key: "touching" }, value)
                return {
                    ...state,
                    fields,
                }
            }
            case FOCUS_FIELD_ERROR_FROM:
            case ON_FOCUS_FIELD_FROM:
            case ON_NEXT_FIELD:
            case IGNORE_WARNING_FROM:
            case FORCUS_FIRST_FROM:
            case UPDATE_CURRENT_DATA_FROM:
            case CHANGE_DATA_FIELD_FROM:
            case ON_BLUR_FIELD_FROM:
            case CHANGE_NEXT_FROM:
            case SET_DISABLE_FIELD:
            case CHANGE_STATE_FROM: {
                return {
                    ...state,
                    ...payload
                };
            }
            case ADD_RECORD: {
                return {
                    ...state,
                    ...payload
                }
            }
            case REMOVE_RECORD: {
                return {
                    ...state,
                    ...payload
                }
            }
            case SET_SECTION_FORM: {
                if (state.valuesInit) {
                    let datas = state.valuesInit({ ...state, ...payload })
                    return {
                        ...state,
                        ...payload,
                        ...datas,
                        valuesInited: state.valuesInit,
                        valuesInit: undefined,
                    }
                }
                return {
                    ...state,
                    ...payload,
                }
            }
            case ADD_RECORD_SECTION: {
                return handleAddRecordSection(state, payload)
            }
            case REMOVE_RECORD_SECTION: {
                return handleRemoveRecordSection(state, payload)
            }
            case SWITCH_RECORD_SECTION: {
                return handleSwitchRecordSection(state, payload)
            }
            case LOAD_DATA_FROM: {
                return handleLoadData(state, payload)
            }
            default:
                return state;
        }
    }
}




