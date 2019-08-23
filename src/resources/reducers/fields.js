import * as types from '../../constants/field_constants';

const initialState = {
  is_fetching: false,

  fields: []
};

const field_list = (state = initialState, action) => {
  switch (action.type) {
    case types.FIELD_LIST_REQUEST:
      return {
        ...state,
        is_fetching: true,
      };
    case types.FIELD_LIST_SET_DATAS:
      return {
        ...state,
        fields: action.fields,
        is_fetching: false
      };
    case types.FIELD_LIST_RESET_DATA:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default field_list;
