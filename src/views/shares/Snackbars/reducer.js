import * as types from './actions';

const initialState = {
  status_text: '',
  common_name: '',
  is_error: false,
  is_processing: false,
  show_snack_bar: false,
  is_redirect: true,
  reason: ''
};

const common_processing = (state = initialState, action) => {
  switch (action.type) {
    case types.COMMON_SEND_HTTP_REQUEST:
      return {
        ...state,
        is_processing: true
      };
    case types.COMMON_RECEIVE_HTTP_RESPONSE:
      return {
        ...state,
        is_processing: false
      };
    case types.COMMON_REQUEST_OPEN_SNACKBAR:
      return {
        ...state,
        is_error: false,
        status_text: action.status_text,
        show_snack_bar: true,
        is_processing: true
      };
    case types.COMMON_RESPOND_OPEN_SNACKBAR:
      return {
        ...state,
        common_name: action.common_name,
        is_error: action.is_error,
        status_text: action.status_text,
        reason: action.reason,
        is_redirect: action.is_redirect,
        show_snack_bar: true,
        is_processing: false
      };
    case types.COMMON_CLOSE_SNACKBAR:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default common_processing;
