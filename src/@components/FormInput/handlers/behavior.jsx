import { getPatternFunc, getTransformFunc } from "../utils";
import { getDataObject } from "@dgtx/coreui";

export const getErrorRecord = (props) => {
    const { datas, sections } = props;
    let sectionNames = Object.keys(datas)
    if (sectionNames.length === 0) {
        return;
    }
    let sectionId = sections.findIndex(item => sectionNames.includes(item.name))
    let sectionName = sections[sectionId].name;
    let rowId = datas[sectionName].findIndex(item => !!item)
    let fieldNames = Object.keys(datas[sectionName][rowId])
    let fieldId = sections[sectionId].fields.findIndex(item => fieldNames.includes(item.name))
    let fieldName = sections[sectionId].fields[fieldId].name
    return {
        sectionId,
        sectionName,
        rowId,
        fieldId,
        fieldName,
    }
}
export const getWaringRecord = (warning) => {
    let sectionNames = Object.keys(warning)
    if (sectionNames.length === 0) {
        return;
    }
    for (let sid = 0; sid < sectionNames.length; sid++) {
        let sectionName = sectionNames[sid];
        let records = warning[sectionName]
        for (let rowID = 0; rowID < records.length; rowID++) {
            let record = records[rowID];
            if (record) {
                let fieldNames = Object.keys(record);
                for (let fid = 0; fid < fieldNames.length; fid++) {
                    if (!record[fieldNames[fid]].ignore) {
                        return {
                            sectionName,
                            rowId: rowID,
                            fieldName: fieldNames[fid]
                        };
                    }
                }
            } else {
                console.log('====================================');
                console.log(records, rowID);
                console.log('====================================');

            }
        }

    }
}
export const getFieldSection = (section, result) => {
    let record = {}
    if (result) {
        section.fields.forEach(field => {
            if (field.ocr_threshold && result[field.name]) {
                const { above, below, confidence } = field.ocr_threshold
                try {
                    let confi = parseFloat(confidence);
                    const confidenceText = parseFloat(result[field.name].confidence || 0) * 100
                    if (confi < confidenceText) { // 
                        if (above === "disable") {
                            record[field.name] = {
                                ...field.field_setting,
                                active: false,
                                disable: true,
                                ocr_threshold: field.ocr_threshold,
                                validationAsync: field.validation.content && field.validation.async,
                                validate: field.validation && field.validation.content && field.validation,
                                pattern: getPatternFunc(field),
                                transform: getTransformFunc(field),
                            }
                        } else if (above === "switch_disable") {
                            record[field.name] = {
                                ...field.field_setting,
                                active: false,
                                disable: true,
                                switch_disable: true,
                                ocr_threshold: field.ocr_threshold,
                                validationAsync: field.validation.content && field.validation.async,
                                validate: field.validation && field.validation.content && field.validation,
                                pattern: getPatternFunc(field),
                                transform: getTransformFunc(field),
                            }
                        } else {
                            record[field.name] = {
                                ...field.field_setting,
                                active: false,
                                ocr_threshold: field.ocr_threshold,
                                validationAsync: field.validation.content && field.validation.async,
                                validate: field.validation && field.validation.content && field.validation,
                                pattern: getPatternFunc(field),
                                transform: getTransformFunc(field),
                            }
                        }
                    } else {
                        record[field.name] = {
                            ...field.field_setting,
                            active: false,
                            highlight: Boolean((below !== 'none') && result[field.name].text),
                            ocr_threshold: field.ocr_threshold,
                            validationAsync: field.validation.content && field.validation.async,
                            validate: field.validation && field.validation.content && field.validation,
                            pattern: getPatternFunc(field),
                            transform: getTransformFunc(field),
                        }
                    }
                } catch (error) {
                    record[field.name] = {
                        ...field.field_setting,
                        active: false,
                        ocr_threshold: field.ocr_threshold,
                        validationAsync: field.validation.content && field.validation.async,
                        validate: field.validation && field.validation.content && field.validation,
                        pattern: getPatternFunc(field),
                        transform: getTransformFunc(field),
                    }
                }
            } else {
                record[field.name] = {
                    ...field.field_setting,
                    active: false,
                    ocr_threshold: field.ocr_threshold,
                    validationAsync: field.validation.content && field.validation.async,
                    validate: field.validation && field.validation.content && field.validation,
                    pattern: getPatternFunc(field),
                    transform: getTransformFunc(field),
                }
            }
        })
    } else {
        section.fields.forEach(field => {
            record[field.name] = {
                ...field.field_setting,
                active: false,
                ocr_threshold: field.ocr_threshold,
                validationAsync: field.validation.content && field.validation.async,
                validate: field.validation && field.validation.content && field.validation,
                pattern: getPatternFunc(field),
                transform: getTransformFunc(field),
            }
        })
    }
    return record;
}

export const getFieldRecord = (sections) => {
    let fields = {};
    sections.forEach(section => {
        fields[section.name] = [getFieldSection(section)];
    });
    return fields;
}


export const isActive = (field, fieldsState) => {
    let _field = fieldsState ? fieldsState[field.name] : field
    return _field && _field.visible && !_field.disable
}
const findFieldNextActive = (fields, fieldsState, index, isNext = true) => {
    let field;
    let indexNext = isNext ? index + 1 : index - 1
    field = fields[indexNext];
    if (field) {
        if (isActive(field, fieldsState)) {
            return field.name
        } else {
            return findFieldNextActive(fields, fieldsState, indexNext, isNext)
        }
    }
    return;
}

export const findFieldNextSectionSingle = (
    {
        sectionName,
        rowId,
        fieldName,
        sections,
        fields,
        sectionId,
        fieldId,
        goto
    }): { fieldNext: Object, current: Object, focusSubmit: boolean } => {
    switch (goto) {
        case 'left':
            break;
        case 'right':
            break;
        case 'up':
            fieldName = findFieldNextActive(sections[sectionId].fields, getDataObject([sectionName, rowId], fields), fieldId, false);
            if (fieldName) {
                return {
                    fieldNext: { sectionName, rowId, fieldName }
                }
            } else if (sectionId > 0) {
                sectionName = sections[sectionId - 1].name;
                return findFieldNextSectionSingle({
                    sectionName,
                    rowId: fields[sectionName].length - 1,
                    fieldName,
                    sections,
                    fields,
                    sectionId: sectionId - 1,
                    fieldId: sections[sectionId - 1].fields.length,
                    goto
                })
            } else {
                return { current: -1 }
            }
        case 'next':
        case 'down':
            fieldName = findFieldNextActive(sections[sectionId].fields, getDataObject([sectionName, rowId], fields), fieldId, true);
            if (fieldName) {
                return {
                    fieldNext: { sectionName, rowId, fieldName }
                }
            } else if (sectionId < sections.length - 1) {
                return findFieldNextSectionSingle({
                    sectionName: sections[sectionId + 1].name,
                    rowId: 0,
                    fieldName,
                    sections,
                    fields,
                    sectionId: sectionId + 1,
                    fieldId: -1,
                    goto
                })
            } else {
                return { current: 1 }
            }
        default:
            break;
    }
}

export const findFieldNextSectionMultiple = (props): { fieldNext: Object, current: Number } => {
    let { sectionName, rowId, fieldName, sections, fields, sectionId, fieldId, goto } = props;
    switch (goto) {
        case 'left':
            fieldName = findFieldNextActive(sections[sectionId].fields, getDataObject([sectionName, rowId], fields), fieldId, false);
            if (fieldName) {
                return {
                    fieldNext: { sectionName, rowId, fieldName }
                }
            } else if (rowId > 0) {
                return findFieldNextSectionMultiple({
                    sectionName,
                    rowId: rowId - 1,
                    fieldName,
                    sections,
                    fields,
                    sectionId,
                    fieldId: sections[sectionId].fields.length,
                    goto
                })
            } else if (sectionId > 0) {
                sectionName = sections[sectionId - 1].name;
                if (sections[sectionId - 1].is_multiple) {
                    return findFieldNextSectionMultiple({
                        sectionName,
                        rowId: fields[sectionName].length - 1,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId - 1,
                        fieldId: sections[sectionId - 1].fields.length,
                        goto
                    })
                } else {
                    return findFieldNextSectionSingle({
                        sectionName,
                        rowId: 0,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId - 1,
                        fieldId: sections[sectionId - 1].fields.length,
                        goto: 'up'
                    })
                }
            } else {
                return { current: -1 }
            }
        case 'next':
        case 'right':
            fieldName = findFieldNextActive(sections[sectionId].fields, getDataObject([sectionName, rowId], fields), fieldId, true);
            if (fieldName) {
                return {
                    fieldNext: { sectionName, rowId, fieldName }
                }
            } else if (rowId < fields[sectionName].length - 1) {
                return findFieldNextSectionMultiple({
                    sectionName,
                    rowId: rowId + 1,
                    fieldName,
                    sections,
                    fields,
                    sectionId,
                    fieldId: -1,
                    goto
                })
            } else if (sectionId < sections.length - 1) {
                sectionName = sections[sectionId + 1].name;
                if (sections[sectionId + 1].is_multiple) {
                    return findFieldNextSectionMultiple({
                        sectionName: sectionName,
                        rowId: fields[sectionName].length - 1,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId + 1,
                        fieldId: -1,
                        goto: "right"
                    })
                } else {
                    return findFieldNextSectionSingle({
                        sectionName,
                        rowId: 0,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId + 1,
                        fieldId: -1,
                        goto: 'down'
                    })
                }
            } else {
                return { current: 1 }
            }
        case 'up':
            if (rowId > 0) {
                if (isActive(fields[sectionName][rowId - 1][fieldName])) {
                    return {
                        fieldNext: {
                            sectionName,
                            rowId: rowId - 1,
                            fieldName
                        }
                    }
                } else {
                    return findFieldNextSectionMultiple({
                        sectionName,
                        rowId: rowId - 1,
                        fieldName,
                        sections,
                        fields,
                        sectionId,
                        fieldId,
                        goto
                    })
                }
            } else if (sectionId > 0) {
                sectionName = sections[sectionId - 1].name;
                if (sections[sectionId - 1].is_multiple) {
                    return findFieldNextSectionMultiple({
                        sectionName,
                        rowId: fields[sectionName].length - 1,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId - 1,
                        fieldId: sections[sectionId - 1].fields.length,
                        goto: "left"
                    })
                } else {
                    return findFieldNextSectionSingle({
                        sectionName,
                        rowId: 0,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId - 1,
                        fieldId: sections[sectionId - 1].fields.length,
                        goto: "up"
                    })
                }
            } else {
                return { current: - 1 }
            }
        case 'down':
            if (rowId < fields[sectionName].length - 1) {
                let field = fields[sectionName][rowId + 1][fieldName]
                if (isActive(field)) {
                    return {
                        fieldNext: {
                            sectionName,
                            rowId: rowId + 1,
                            fieldName
                        }
                    }
                } else {
                    return findFieldNextSectionMultiple({
                        sectionName,
                        rowId: rowId + 1,
                        fieldName,
                        sections,
                        fields,
                        sectionId,
                        fieldId,
                        goto
                    })
                }
            } else if (sectionId < sections.length - 1) {
                sectionName = sections[sectionId + 1].name;
                if (sections[sectionId + 1].is_multiple) {
                    return findFieldNextSectionMultiple({
                        sectionName: sectionName,
                        rowId: fields[sectionName].length - 1,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId + 1,
                        fieldId: -1,
                        goto: "right"
                    })
                } else {
                    return findFieldNextSectionSingle({
                        sectionName,
                        rowId: 0,
                        fieldName,
                        sections,
                        fields,
                        sectionId: sectionId + 1,
                        fieldId: -1,
                        goto
                    })
                }
            } else {
                return { current: 1 }
            }
        default:
            break;
    }
}