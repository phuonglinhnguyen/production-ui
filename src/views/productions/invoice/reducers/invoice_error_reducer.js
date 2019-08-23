import clone from 'clone';
import {
  INVOICE_CLOSE_WARNING_LIST,
  INVOICE_ERROR_RESET_STATE,
  INVOICE_OPEN_WARNING_LIST,
  INVOICE_UPDATE_ERROR
} from '../constants/invoice_constant';

const initialState = {
  error_record: {},
  error_detail: null,

  warning_list: [],
  is_open_warning_list: false,
  warning_field: [],
  action_warning_list: null
};

const invoice_document = (state = clone(initialState), action) => {
  switch (action.type) {
    case INVOICE_UPDATE_ERROR:
      return {
        ...state,
        error_record: clone(action.error_record),
        error_detail: clone(action.error_detail),
        warning_list: clone(action.warning_list)
      };
    case INVOICE_OPEN_WARNING_LIST:
      return {
        ...state,
        action_warning_list: action.action_warning_list,
        is_open_warning_list: true,
        warning_field: clone(action.warning_field)
      };
    case INVOICE_CLOSE_WARNING_LIST:
      return {
        ...state,
        is_open_warning_list: false,
        warning_field: []
      };
    case INVOICE_ERROR_RESET_STATE:
      return clone(initialState);
    default:
      return state;
  }
};
export default invoice_document;
