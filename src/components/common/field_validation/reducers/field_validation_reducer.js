import * as types from "../constants/field_validation_constants";

const initialState = {
  is_fetching: false,
  validations: []
};

const field_validation = (state = initialState, action) => {
  switch (action.type) {
    case types.FIELD_VALIDATION_VALIDATE_ITEM:
      const { name, row, message, field } = action;

      var validationList = [...state.validations];
      if (!message) {
        validationList = validationList.filter(item => item.name !== name || item.row !== row);
      } else {
        const validateIndex = validationList.findIndex(ele =>
          ele.row === row
          && ele.name === name);
        const validateResult = {
          ...field,
          name: name,
          row: row,
          message: message
        }
        if (validateIndex !== -1) {
          validationList[validateIndex] = validateResult;
        } else {
          validationList.push(validateResult);
        }


      }

      return {
        ...state,
        validations: validationList
      };
    case types.FIELD_VALIDATION_RESET:
      return {
        ...state,
        validations: []
      };
    default:
      return state;
  }
};
export default field_validation;
