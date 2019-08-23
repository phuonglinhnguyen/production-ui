import { API_LOOKUP } from "../../constants";

export const getLinkByField = ({
    locale = [],
    lookup_field,
    group_project,
    specific_project,
}) => {
    let _locale = locale.map(item => item.trim()).join(',');
    if (_locale.toLocaleLowerCase) {
        _locale = _locale.toLocaleLowerCase()
    } else if (_locale.toLowerCase) {
        _locale = _locale.toLowerCase()

    }
    try {
        return `${API_LOOKUP}/${group_project}/${_locale}/${specific_project || '2092'}/${lookup_field}`;
    } catch (error) {
        return '';
    }
};
export const getTextByCusor = (value: string, index: number, multiLine: Boolean) => {

}

const getTextCurrent = (value, indexCursor, allow_multiple, multiLine) => {
    let currentValue = value.substring(0, indexCursor)
    if (!allow_multiple) {
        return currentValue;
    } else {
        let separators = ' ';
        if (multiLine) {
            separators = new RegExp([' ', '\\n'].join('|'), 'g');
        }
        // eslint-disable-next-line
        return currentValue.split(separators).pop();;
    }
}

const getValueCurrent = (value, point, delimiter) => {
    let vals = value.split(delimiter)
    let form = value.substr(0, point)
    let valsFrom = form.split(delimiter)
    let indexVal = valsFrom.length - 1
    return { cursorIndex: valsFrom[indexVal].trim().length, valFull: vals[indexVal].trim(), indexVal }
}

const getParamLookupAncestry = (value, indexCursor, allow_multiple, multiLine) => {
    let currentValue = getTextCurrent(value, indexCursor, allow_multiple, multiLine)
    let params = [currentValue, value];
    return params;
}

export const getParamLookup = (lookupConfig, value, selectionStart, FieldBroadcastService, broadcastChannel) => {
    if (lookupConfig.multiple_delimiter && lookupConfig.multiple_delimiter.length) {
        let { cursorIndex, valFull, indexVal } = getValueCurrent(value, selectionStart, lookupConfig.multiple_delimiter)
        if (lookupConfig.param_set) {
            const libs = {
                getValueCurrent, getTextCurrent: (val, pointer) => {
                    return getTextCurrent(val, pointer, lookupConfig.allow_multiple)
                }
            }
            let params = FieldBroadcastService.getParam(broadcastChannel, selectionStart, getFunctionParamSet(lookupConfig.param_set, value, libs, lookupConfig.multiple_delimiter));
            return { params, indexVal };
        } else {
            return { params: getParamLookupAncestry(valFull, cursorIndex, lookupConfig.allow_multiple), indexVal };
        }
    } else {
        if (lookupConfig.param_set) {
            let params = FieldBroadcastService.getParam(broadcastChannel, selectionStart, getFunctionParamSet(lookupConfig.param_set, value));
            return { params };
        } else {
            return { params: getParamLookupAncestry(value, selectionStart, lookupConfig.allow_multiple) };
        }
    }
}
const getFunctionParamSet = (param_set, value, libs, delimiter) => {
    try {
        //eslint-disable-next-line
        const func = new Function(['data', 'indexCursor', 'value', 'libs', 'delimiter'], param_set);
        return (data, indexCursor) => {
            try {
                let _data = func(data, indexCursor, value, libs, delimiter);
                return _data.map(item => item ? item : "");
            } catch (error) {
                return [];
            }
        }
    } catch (error) {
        return () => [];
    }
}
const fetchJSON = async (uri, options = { method: 'get' }) => {
    let res = await fetch(uri, { ...options })
    let result = await res.json()
    return result;
}
export const loadHandleBroadCast = (handleBroadCast) => {
    try {
        if (handleBroadCast.content && handleBroadCast.content.trim().length) {
            const argDefined = handleBroadCast.arguments || {};
            const script = handleBroadCast.content;
            const argMapKey = Object.keys(argDefined);
            const argMapValue = Object.values(argDefined);
            // const value_broadcast = validation.value_broadcast;
            const input = ['fetchJSON', 'currentValue', 'value', 'author', 'indexVal', 'field', 'record'].concat(argMapKey).join(',');
            // const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
            const fnc = new Function(input, script);//eslint-disable-line no-new-func
            return (currentValue, value = '', author, indexVal, field, record) => {
                const parameters = [fetchJSON, currentValue, value, author, indexVal, field, record].concat(argMapValue.map(arg => record[arg].text || ''));
                try {
                    let result = fnc.apply(this, parameters);
                    return result;
                } catch (e) {
                    return;
                }
            }
        }
        return;
    } catch (error) {
        return;
    }

}

export const loadConfigLookup = (field) => {
    if (field.lookup_source && field.lookup_source.lookup_field && field.lookup_source.lookup_field.length) {
        let lookupUrl = getLinkByField(field.lookup_source);
        let param_set;
        let subscribeFields = [field.name];
        if (field.lookup_source.param_set && field.lookup_source.param_set.length) {
            param_set = field.lookup_source.param_set;
        }
        return {
            lookupUrl,
            name: field.name,
            key_value: field.lookup_source.key_value || 'data_value',
            lookup_space_after_choosen: field.lookup_source.lookup_space_after_choosen,
            group_project: field.lookup_source.group_project,
            allow_multiple: field.lookup_source.allow_multiple,
            multiple_delimiter: field.lookup_source.multiple_delimiter,
            characters_trigger_lookup: field.lookup_source.characters_trigger_lookup,
            related_columns: field.lookup_source.related_columns,
            locale: field.lookup_source.locale,
            lookup_after_time: field.lookup_source.lookup_after_time,
            lookup_broadcast: field.lookup_broadcast,
            param_set: param_set,
            config_view: field.lookup_source.result_view_config,
            subscribeFields,
        }
    } else if (field.control_type === "COMBOBOX") {
        let argument_details = field.argument_details.map(item => ({ value: item.value || item })) || []
        argument_details = [{ value: '' }, ...argument_details]
        return {
            lookupUrl: '',
            name: field.name,
            argument_details: argument_details,
            key_value: 'data_value',
            group_project: '',
            allow_multiple: true,
            characters_trigger_lookup: 0,
            related_columns: [],
            locale: [],
            lookup_after_time: 0,
            lookup_broadcast: {},
            param_set: ``,
            config_view: [{ key_value: "data_value", title: "Options" }],
            subscribeFields: [field.name],
        }
    } else {
        return;
    }
}


export const getValueByIndex = (rowIndex, colIndex, valueLookups) => {
    if (valueLookups[colIndex] && valueLookups[colIndex][rowIndex])
        return valueLookups[colIndex][rowIndex];
    return !1;
}
export const cancelEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
}

export const getTargetScrollLocation = (target, parent, align) => {
    var targetPosition = target.getBoundingClientRect(),
        parentPosition,
        x,
        y,
        differenceX,
        differenceY,
        targetWidth,
        targetHeight,
        leftAlign = align && align.left != null ? align.left : 0.5,
        topAlign = align && align.top != null ? align.top : 0.5,
        leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
        topOffset = align && align.topOffset != null ? align.topOffset : 0,
        leftScalar = leftAlign,
        topScalar = topAlign;
    if (parent === window) {
        targetWidth = Math.min(targetPosition.width, window.innerWidth);
        targetHeight = Math.min(targetPosition.height, window.innerHeight);
        x = targetPosition.left + window.pageXOffset - window.innerWidth * leftScalar + targetWidth * leftScalar;
        y = targetPosition.top + window.pageYOffset - window.innerHeight * topScalar + targetHeight * topScalar;
        x -= leftOffset;
        y -= topOffset;
        differenceX = x - window.pageXOffset;
        differenceY = y - window.pageYOffset;
    } else {
        targetWidth = targetPosition.width;
        targetHeight = targetPosition.height;
        parentPosition = parent.getBoundingClientRect();
        var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
        var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
        x = offsetLeft + (targetWidth * leftScalar) - parent.clientWidth * leftScalar;
        y = offsetTop + (targetHeight * topScalar) - parent.clientHeight * topScalar;
        x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
        y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
        x -= leftOffset;
        y -= topOffset;
        differenceX = x - parent.scrollLeft;
        differenceY = y - parent.scrollTop;
    }

    return {
        x: x,
        y: y,
        differenceX: differenceX,
        differenceY: differenceY
    };
}
export const needScroll = (target, align, single) => {
    let parent = target.parentElement.parentElement.parentElement;
    let position = getTargetScrollLocation(target, parent, align);
    if (single) {
        return 0 !== position.differenceY;
    } else {
        return 0 !== position.differenceY || 0 !== position.differenceX;
    }
}
export const getValueSingleCharacter = (val, cusorIndex, valNew, character) => {
    let isSpace = (character && character.length > 0 && character.trim().length === 0)
    let start = val.substring(0, cusorIndex - (isSpace ? 0 : 1));
    let end = val.substring(cusorIndex, val.length);
    return `${start}${valNew}${end}`;
}
export const getValueSingle = (val, cusorIndex, valNew, addSpace) => {
    let start = val.substring(0, cusorIndex - val.substring(0, cusorIndex).split(' ').pop().length);
    let end = val.substring(cusorIndex + val.substring(cusorIndex, val.length).split(' ')[0].length, val.length);
    if (addSpace && end.length === 0) {
        return `${start}${valNew}${' '}`;
    }
    return `${start}${valNew}${end}`;
}

export const getValueCopy = (val, cusorIndex, valNew, addSpace) => {
    let start = val.substring(0, cusorIndex);
    let end = val.substring(cusorIndex, val.length);
    if (addSpace && end.length === 0) {
        return [`${start}${valNew}${' '}`, `${start}${valNew}`.length];
    }
    return [`${start}${valNew}${end}`, `${start}${valNew}`.length];
}

export const getValueSingleMultiple = (val, cusorIndex, valNew, delimiter, addSpace) => {
    let tmp = val.split(delimiter)
    tmp[cusorIndex] = ' ' + valNew + (addSpace ? ' ' : '');
    let cursorNextIndex = tmp.slice(0, cusorIndex + 1).join(delimiter).length
    return [tmp.join(delimiter), cursorNextIndex]
}