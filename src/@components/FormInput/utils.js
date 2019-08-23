

export const KEY_FIELD_TYPE_NUMERIC = 'NUMERIC';
export const KEY_FIELD_TYPE_DATE = 'DATE';
export const KEY_FIELD_TYPE_CURRENCY = 'CURRENCY';
const getValitionFuncSection = (section) => {
    if (section.validation && section.validation.content) {
        try {
            const argDefined = section.validation.arguments;
            const script = section.validation.content;
            const argMapKey = Object.keys(argDefined);
            const argMapValue = //Object.values(argDefined); 
                Object.keys(argDefined).map(function (key) {
                    return argDefined[key];
                });
            const value_broadcast = section.validation.value_broadcast;//eslint-disable-line no-unused-vars
            const input = ['value', 'record', 'section', 'dataExtract'].concat(argMapKey).join(',');
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (value = [], record, dataExtract) => {
                const parameters = [value, record, section, dataExtract].concat(argMapValue.map(arg => record[arg] || ''));
                try {
                    let result = fnc.apply(this, parameters);
                    // if (result && typeof result !== 'string') {
                    //     result = result
                    // }
                    return result;
                } catch (e) {
                    return e.toString();
                }
            }
        } catch (error) {
            return;
        }
    } else {
        return;
    }
}
export const getValidationSection = (sections: Array<Object>) => {
    let rs = {}
    sections.forEach(section => {
        rs[section.name] = getValitionFuncSection(section);
    })
    return rs;
}


export const getValitionFunc = (field) => {
    if (field.validation && field.validation.content) {
        try {
            const argDefined = field.validation.arguments;
            const script = field.validation.content;
            const argMapKey = Object.keys(argDefined);
            const argMapValue = //Object.values(argDefined); 
                Object.keys(argDefined).map(function (key) {
                    return argDefined[key];
                });

            const value_broadcast = field.validation.value_broadcast;//eslint-disable-line no-unused-vars
            const input = ['value', 'rowId', 'record', 'section', 'layout'].concat(argMapKey).join(',');
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (value = '', rowId, record = {}, section = [], layout = {}) => {
                const parameters = [value, rowId, record, section, layout].concat(argMapValue.map(arg => record[arg] || ''));
                try {
                    let result = fnc.apply(this, parameters);
                    return result;
                } catch (e) {
                    return e.toString();
                }
            }
        } catch (error) {
            return;
        }
    } else {
        return;
    }
}
export const getPatternFunc = (field: Field) => {
    if (field.pattern && field.pattern.content) {
        const pattern = field.pattern.content
        const ms = field.pattern.description;
        return (val = '') => (new RegExp(pattern, 'g').test(val) ? undefined : ms);
    } else {
        return;
    }
}

export const getTransformFunc = (field) => {
    if (field.rule_transform && field.rule_transform.content) {
        try {
            const argDefined = field.rule_transform.arguments;
            const script = field.rule_transform.content;
            const argMapKey = Object.keys(argDefined);
            const argMapValue = //Object.values(argDefined); 
                Object.keys(argDefined).map(function (key) {
                    return argDefined[key];
                });
            const input = ['value', 'rowId', 'record', 'section', 'layout'].concat(argMapKey).join(',');
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (value = '', rowId, record = {}, section = [], layout = {}) => {
                const parameters = [value, rowId, record, section, layout].concat(argMapValue.map(arg => record[arg] || ''));
                try {
                    let result = fnc.apply(this, parameters);
                    if (result && typeof result !== 'string') {
                        result = result.toString();
                    }
                    return result;
                } catch (e) {
                    return value;
                }
            }
        } catch (error) {
            return;
        }
    } else {
        return;
    }
}

const KEY_RECENT_DATA_STORAGE = 'recent_data_storagess';

export const setIn = (state, { sectionName, rowId, fieldName, key }, value) => {
    try {
        state[sectionName] = state[sectionName] || []
        state[sectionName][rowId] = state[sectionName][rowId] || {}
        if (key) {
            state[sectionName][rowId][fieldName] = state[sectionName][rowId][fieldName] || {}
            state[sectionName][rowId][fieldName][key] = value
        } else {
            state[sectionName][rowId][fieldName] = value
        }
    } catch (error) {
        console.log('setIn===================================');
        console.log({ sectionName, rowId, fieldName, key }, error);
        console.log('====================================');
    }
    return state;
}
export const getIn = (state, { sectionName, rowId, fieldName, key }) => {
    try {
        if (key) {
            return state[sectionName][rowId][fieldName][key]
        } else if (fieldName) {
            return state[sectionName][rowId][fieldName]
        } else if (rowId) {
            return state[sectionName][rowId]
        } else {
            return state[sectionName]
        }
    } catch (error) {
        return null;
    }
}

export const delectInKey = (state, { sectionName, rowId, fieldName, key }) => {
    delete state[sectionName][rowId][fieldName][key]
    if (Object.keys(state[sectionName][rowId][fieldName]).length === 0) {
        delectInField(state, { sectionName, rowId, fieldName })
    }
}
export const delectInField = (state, { sectionName, rowId, fieldName }) => {
    delete state[sectionName][rowId][fieldName]
    if (Object.keys(state[sectionName][rowId]).length === 0) {
        delectInRecord(state, { sectionName, rowId })
    }
}
export const delectInRecord = (state, { sectionName, rowId }) => {
    delete state[sectionName][rowId]
    if (Object.keys(state[sectionName]).length === 0) {
        delete state[sectionName]
    }
}
export const delectIn = (state, { sectionName, rowId, fieldName, key }) => {
    try {
        if (key) {
            delectInKey(state, { sectionName, rowId, fieldName, key })
        } else if (fieldName) {
            delectInField(state, { sectionName, rowId, fieldName })
        } else if (rowId) {
            delectInRecord(state, { sectionName, rowId })
        } else {
            delete state[sectionName]
        }
    } catch (error) {
    }
}

export const removeWordInFieldValue = (field_value, new_value) => {
    let new_text_arr = new_value.text || '';
    let words = new_value.words;
    let final_words = [];
    Object.values(words).forEach(word => {
        if (word && new_text_arr.indexOf(word.text) !== -1) {
            final_words.push(word);
        }
    })
    return {
        ...field_value,
        text: new_value.text,
        words: final_words
    };
};

export const loadDataRecends = (taskId) => {
    let data = localStorage.getItem(KEY_RECENT_DATA_STORAGE);
    if (data) {
        try {
            data = JSON.parse(data);
            if (data.taskId === taskId) {
                return data.values
            }
        } catch (error) {

        }
    }
    localStorage.setItem(KEY_RECENT_DATA_STORAGE, "")
}
export const setDataRecends = (taskId, data) => {
    localStorage.setItem(KEY_RECENT_DATA_STORAGE, JSON.stringify({ taskId, values: data }))
}
export const clearDataRecends = (taskId, data) => {
    localStorage.setItem(KEY_RECENT_DATA_STORAGE, {})
}



export const formatFieldValue = (field: Object, value: string) => {
    let text = value;
    switch (field.text_type) {
        case KEY_FIELD_TYPE_NUMERIC:
            if (!value) {
                return '';
            }
            let arr = text.split('.');
            text = arr[0] + '.' + arr[1] || 0;
            text = parseFloat(text).toFixed(2);
            return text;
            break;
        case KEY_FIELD_TYPE_DATE:
            if (text.length === 6) {
                let current_year = new Date().getFullYear();
                let plus_year = 20 + text.slice(4, 6);
                if (parseInt(plus_year) > current_year) {
                    plus_year = 19 + text.slice(4, 6);
                }
                text = text.slice(0, 4) + plus_year;
            }
            return text;
            break;
        default:
            return value;
            break;
    }
};

// console.log('====================================');
// console.log(value);
// console.log(record);
// console.log(section);
// console.log(layout);
// console.log('====================================');


// function checkSum(value, data, sectionName, fieldName) {
//     var dataTotal = data[sectionName].map(item => Number(item[fieldName] && item[fieldName].text || 0))
//     console.log(dataTotal);
//     console.log('====================================');
//    var totalNet = dataTotal.reduce((total, item) => {
//         return total + item
//     },0)
//     if (Math.fround((totalNet)*100000)/100000 !== Number(value)) {
//         return [{ type: "warning", message: "Not equal" }]
//     }
// }
// return checkSum(value, layout, "Line Item", "amount_net")

// function checkSum(a, b, c, d) {
//     var e = b[c].reduce((f = 0, g) => { return f + +(g[d] && g[d].text) });
//     if (e !== +a) return [{ type: "warning", message: "Not equal" }]
// }
// function getDataField(layout, sectionName, rowId, fieldName) {
//     try {
//         return layout[sectionName][rowId][fieldName].text
//     } catch (error) {
//         return '';
//     }
// }

export const analysisDynamicFields = (fields, values) => {
    let isDynamic = false;
    fields.forEach((record, current) => {
        Object.keys(record).forEach(sectionName => {
            let sectionDatas = record[sectionName];
            sectionDatas.forEach((row, rowId) => {
                Object.keys(row).forEach(fieldName => {
                    if (row[fieldName].dynamic_by_field) {
                        isDynamic = true;
                        row[fieldName] = { ...row[fieldName], ...getEffectDynamicField(row[fieldName].dynamic_by_field, rowId, 0, values[current]) }
                    }
                })
            })
        })
    })
    return isDynamic;
}

// export const getEffectDynamicField = ({ effect,
//     field,
//     rule,
//     section,
//     value }, rowId, values) => {
//     let _value = getIn(values, { sectionName: section, rowId, fieldName: field })
//     _value = _value && _value.text && _value.text.trim() || '';
//     let active = false;
//     if (_value) {
//         let valueCheck = Array.isArray(value) ? value : value.split(';');
//         if (rule === "must_equal") {
//             active = valueCheck.includes(_value)
//         } else {
//             active = Boolean(valueCheck.filter(item => item.includes(_value)).length)
//         }
//     }
//     const result = {};
//     if (effect === 'visible') {
//         result["visible"] = active
//     } else {
//         result["disable"] = !active
//     }
//     return result
// }
export const EFFECT_FIELD_KEY = {
    VISIBLE: 'visible',
    INVISIBLE: 'invisible',
    ENABLE: 'enable',
    DISABLE: 'disable',
}
export const EFFECT_KEY = {
    MUST_EQUAL: 'must_equal',
    CONTAIN: 'contain',
    REGEX: 'regex',
    FUNCTION: 'func',
}
const getAnalysisField = (rowId, rowIdCurrent, values) => (proup) => {
    const { value, section, rule, field } = proup;
    let _value;
    if (getIn(values, { sectionName: section, rowId: rowIdCurrent })) {
        _value = getIn(values, { sectionName: section, rowId: rowIdCurrent, fieldName: field });
    } else if (getIn(values, { sectionName: section, rowId })) {
        _value = getIn(values, { sectionName: section, rowId, fieldName: field })
    } else {
        _value = getIn(values, { sectionName: section, rowId: 0, fieldName: field })
    }
    _value = _value && _value.text && _value.text.trim() || '';
    switch (rule) {
        case EFFECT_KEY.MUST_EQUAL: {
            let valueCheck = Array.isArray(value) ? value.map(t => t.trim()) : value.split(';').map(t => t.trim());
            return valueCheck.includes(_value)
        }
        case EFFECT_KEY.CONTAIN: {
            let valueCheck = Array.isArray(value) ? value : value.split(';');
            return Boolean(valueCheck.filter(item => _value.includes(item.trim())).length)
        }
        case EFFECT_KEY.REGEX:
            return new RegExp(value, 'g').test(_value)
        default: {
            const input = ['value', 'row', 'rowId', 'section', 'record']
            const fnc = new Function(input, value);//eslint-disable-line no-new-func
            try {
                const parameters = [_value, getIn(values, { sectionName: section, rowId }), rowId, getIn(values, { sectionName: section }), values];
                return fnc.apply(this, parameters);
            } catch (error) {
                return false;
            }
        }
    }
}

const getAnalysisGroup = (rowId, rowIdCurrent, values) => (proup) => {
    return proup.map(getAnalysisField(rowId, rowIdCurrent, values)).every(Boolean)
}
export const getEffectDynamicField = ({ effect, groups }, rowId, rowIdCurrent, values) => {
    if (groups) {
        let active = groups.map(getAnalysisGroup(rowId, rowIdCurrent, values)).filter(Boolean).length > 0
        switch (effect) {
            case EFFECT_FIELD_KEY.VISIBLE:
                return { visible: active }
            case EFFECT_FIELD_KEY.INVISIBLE:
                return { visible: !active }
            case EFFECT_FIELD_KEY.ENABLE:
                return { disable: !active }
            default:
                return { disable: active }
        }
    } else {
        return {}
    }
}
/*
  */

export const cleanDataDynamic = (fields, valueLayout) => {
    Object.keys(fields).forEach(sectionName => {
        let _section = fields[sectionName][0]
        if (Object.values(_section).filter(item => item.visible).length > 0) {
            if (!valueLayout[sectionName]) {
                valueLayout[sectionName] = [{}]
                // fields[sectionName] = getFieldRecord(state.sections)[sectionName][0]
            } else {
                Object.keys(_section).forEach(fieldName => {
                    if (!_section[fieldName].visible) {
                        valueLayout[sectionName].forEach(rowData => {
                            delete rowData[fieldName]
                        })
                    }
                })
            }
        } else {
            fields[sectionName] = [fields[sectionName][0]]
            delete valueLayout[sectionName]
        }
    })
}