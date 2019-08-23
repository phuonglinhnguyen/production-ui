import * as types from '../constants/field_validation_constants';
import * as validation_constants from '../../../../constants/validation_constants'
import * as field_constants from '../../../../constants/field_constants'


type FieldProps = {
    tabIndex: Number,
    name: Number,
    value: String,
    row: Number,

}

/**
 * 
 * @param {*} field : field will be validated : field:{name:'field_1',value:'field_1_value'}
 * @param {*} record : record data {field_1:'field_1_value',field_2:'field_2_value'}
 */

export const validateField = (
    field: FieldProps,
    record: Object) => (dispatch, getState) => {

        const { name, row, value } = field;
        var fieldDefine = { ...field }
        if (!field[field_constants.KEY_VALIDATION]) {
            const fieldList = getState().field_definition.field_list.fields || [];

            fieldDefine = fieldList.find(el => el.name === name);
        }
        var result = "";
        if (fieldDefine &&
            fieldDefine[field_constants.KEY_VALIDATION] &&
            fieldDefine[field_constants.KEY_VALIDATION][validation_constants.KEY_VALIDATION_SCRIPT]) {
            try {
                let input = 'value';
                let parameters = [];
                parameters.push(value);
                const validation_arguments = fieldDefine[field_constants.KEY_VALIDATION][validation_constants.KEY_VALIDATION_ARGUMENTS];
                Object.keys(validation_arguments).forEach(variable => {
                    input = input + ',' + variable;
                    parameters.push(record[validation_arguments[variable]] || '');
                });


                var fnc = Function(`${input}`, `${fieldDefine[field_constants.KEY_VALIDATION][validation_constants.KEY_VALIDATION_SCRIPT]}`); //eslint-disable-line
                result = fnc.apply(this, parameters);

            } catch (error) {
                result = error + ""
            }

        }
      
        dispatch({
            type: types.FIELD_VALIDATION_VALIDATE_ITEM,
            name: name,
            row: row,
            message: result,
            field: field

        })
    };
export const validationReset = (

) => (dispatch, getState) => {

    dispatch({
        type: types.FIELD_VALIDATION_RESET,



    })
};


