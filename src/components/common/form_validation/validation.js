import {
    KEY_PATTERN,
    KEY_VALIDATION,
} from '../../../constants/field_constants';
import {
    KEY_PATTERN_CONTENT,
    KEY_PATTERN_DESCRIPTION
} from '../../../constants/pattern_constants';

import {
    KEY_VALIDATION_SCRIPT,
    KEY_VALIDATION_ARGUMENTS,
} from '../../../constants/validation_constants';

const getValitionFunc = (field) => {
    if (field[KEY_VALIDATION] && field[KEY_VALIDATION][KEY_VALIDATION_SCRIPT]) {
        try {
            const argDefined = field[KEY_VALIDATION][KEY_VALIDATION_ARGUMENTS];
            const script = field[KEY_VALIDATION][KEY_VALIDATION_SCRIPT];
            const argMapKey = Object.keys(argDefined);
            const argMapValue = //Object.values(argDefined); 
                Object.keys(argDefined).map(function (key) {
                    return argDefined[key];
                });

            const value_broadcast = field[KEY_VALIDATION].value_broadcast;//eslint-disable-line no-unused-vars
            const input = ['value'].concat(argMapKey).join(',');
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (value = '', record = {}) => {
                const parameters = [value].concat(argMapValue.map(arg => record[arg] || ''));
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
            return (val) => undefined;
        }
    } else {
        return () => undefined;
    }
}

const getValitionFuncSection = (section) => {
    if (section[KEY_VALIDATION] && section[KEY_VALIDATION][KEY_VALIDATION_SCRIPT]) {
        try {
            const argDefined = section[KEY_VALIDATION][KEY_VALIDATION_ARGUMENTS];
            const script = section[KEY_VALIDATION][KEY_VALIDATION_SCRIPT];
            const argMapKey = Object.keys(argDefined);
            const argMapValue = //Object.values(argDefined); 
                Object.keys(argDefined).map(function (key) {
                    return argDefined[key];
                });
            const value_broadcast = section[KEY_VALIDATION].value_broadcast;//eslint-disable-line no-unused-vars
            const input = ['value','record','section'].concat(argMapKey).join(',');
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (value={},record) => {
                const parameters = [value, record, section].concat(argMapValue.map(arg => record[arg] || ''));
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
            return (val) => undefined;
        }
    } else {
        return () => undefined;
    }
}

const getPatternFunc = (field) => {
    if (field[KEY_PATTERN] && field[KEY_PATTERN][KEY_PATTERN_CONTENT]) {
        const pattern = field[KEY_PATTERN][KEY_PATTERN_CONTENT];
        const ms = field[KEY_PATTERN][KEY_PATTERN_DESCRIPTION]
        return (val='') => (new RegExp(pattern, 'g').test(val) ? undefined : ms);
    } else {
        return () => (undefined);
    }
}
export const getValidationAndPatternMap = (fields: Array<Object>) => {
    let rs = {}
    fields.forEach(field => {
        rs[field.name] = {
            checkValidate: getValitionFunc(field),
            checkPattern: getPatternFunc(field),
        }
    })
    return rs;
}

export const getValidationSection = (sections: Array<Object>) => {
    let rs = {}
    sections.forEach(section => {
        rs[section.name] =  getValitionFuncSection(section)
    })
    return rs;
}



export default {
    getValidationAndPatternMap,
    getValidationSection
}