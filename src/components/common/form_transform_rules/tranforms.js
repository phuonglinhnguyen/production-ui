import {
    KEY_RULE_TRANSFORM,
} from '../../../constants/field_constants';

import {
    KEY_VALIDATION_SCRIPT,
    KEY_VALIDATION_ARGUMENTS,
} from '../../../constants/validation_constants';

const getTranformFunc = (field) => {
    if (field[KEY_RULE_TRANSFORM] && field[KEY_RULE_TRANSFORM][KEY_VALIDATION_SCRIPT]) {
        try {
            const argDefined = field[KEY_RULE_TRANSFORM][KEY_VALIDATION_ARGUMENTS];
            const script = field[KEY_RULE_TRANSFORM][KEY_VALIDATION_SCRIPT];
            const argMapKey = Object.keys(argDefined);
            const argMapValue = //Object.values(argDefined); 
                Object.keys(argDefined).map(function (key) {
                    return argDefined[key];
                });
            const input = ['value'].concat(argMapKey).join(',');
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (value = '', record = {}) => {
                const parameters = [value].concat(argMapValue.map(arg => record[arg] || ''));
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
export const getTranformMap = (fields: Array<Object>) => {
    let rs = {}
    try {
        fields.forEach(field => {
            let tranform = getTranformFunc(field);
            if (tranform) {
                rs[field.name] = tranform;
            }
        })
    } catch (error) { }
    if (Object.keys(rs).length) {
        return rs;
    } else {
        return;
    }
}

export default {
    getTranformMap
}