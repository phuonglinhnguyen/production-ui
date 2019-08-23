import { API_LOOKUP } from '../../../../../constants';
export const getLinkByField = field => {
    const { lookup_source } = field;
    try {
        return `${API_LOOKUP}/${lookup_source.group_project}/${lookup_source.locale.join(
            ','
        )}/${lookup_source.specific_project||'2092'}/${lookup_source.lookup_field}`;
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

const getParamLookupAncestry = (value, indexCursor, allow_multiple, multiLine) => {
    let currentValue = getTextCurrent(value, indexCursor, allow_multiple, multiLine)
    let params = [currentValue, value];
    return params;
}

export const getParamLookup = (lookupConfig, value, selectionStart, FieldBroadcastService,broadcastChannel) => {
    if (lookupConfig.param_set) {
        let _param_set_data = FieldBroadcastService.getParam(broadcastChannel, getFunctionParamSet(lookupConfig.param_set));
        return _param_set_data;
    } else {
        return getParamLookupAncestry(value, selectionStart, lookupConfig.allow_multiple);
    }
}
const getFunctionParamSet = (param_set) => {
    try {
        //eslint-disable-next-line
        const func = new Function(['data'], param_set);
        return (data) => {
            try {
                let _data = func(data);
                return _data.map(item =>item?item:"");
            } catch (error) {
                return [];
            }
        }
    } catch (error) {
        return () => [];
    }
}
export const loadConfigLookup = (field) => {
    if (field.lookup_source && field.lookup_source.lookup_field && field.lookup_source.lookup_field.length) {
        let lookupUrl = getLinkByField(field);
        let param_set;
        let subscribeFields = [field.name];
        if (field.lookup_source.param_set && field.lookup_source.param_set.length) {
            param_set = field.lookup_source.param_set;
        }
        return {
            lookupUrl,
            name: field.name,
            key_value: field.lookup_source.key_value || 'data_value',
            group_project: field.lookup_source.group_project,
            allow_multiple: field.lookup_source.allow_multiple,
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
        return {
            lookupUrl:'',
            name: field.name,
            argument_details:field.argument_details.map(item=>({value:item.value||item}))||[],
            key_value: 'data_value',
            group_project: '',
            allow_multiple:true,
            characters_trigger_lookup: 0,
            related_columns: [],
            locale: [],
            lookup_after_time: 0,
            lookup_broadcast: {},
            param_set: ``,
            config_view: [{key_value:"data_value",title:"Options"}],
            subscribeFields:[field.name],
        }
      }else{
          return ;
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
export const getValueSingle = (val, cusorIndex, valNew) => {

    let start = val.substring(0, cusorIndex - val.substring(0, cusorIndex).split(' ').pop().length);
    let end = val.substring(cusorIndex + val.substring(cusorIndex, val.length).split(' ')[0].length, val.length);
    return `${start}${valNew}${end}`;
}