import {
  VERIFY_KEY_RECIEVE_FIELDS_DEFINITION,
  VERIFY_KEY_REQUEST_FIELDS_DEFINITION,
  VERIFY_KEY_RESET_STATE_FIELDS_DEFINITION
} from '../constants/verify_key_contants';

const initialState = {
  is_fetching: false,
  data: [],
  field_required: []
};

const section_definition = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_KEY_REQUEST_FIELDS_DEFINITION:
      return { ...state, is_fetching: true };
    case VERIFY_KEY_RECIEVE_FIELDS_DEFINITION:
      return {
        ...state,
        is_fetching: false,
        data: [...action.data],
        field_required: [...action.field_required]
      };
    case VERIFY_KEY_RESET_STATE_FIELDS_DEFINITION:
      return { ...initialState };
    default:
      return state;
  }
};
export default section_definition;
