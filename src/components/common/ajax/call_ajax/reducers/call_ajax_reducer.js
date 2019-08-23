import * as constants from "../constants/call_ajax_constants";

const initialState = {
  is_calling: false,
  status_text: "",
  show_snack_bar: false
};

const call_ajax = (state = initialState, action) => {
  switch (action.type) {
    case constants.CALL_AJAX_REQUSEST:
      return {
        ...state,
        is_calling: true,
        action_type: action.action_type
      };
    case constants.CALL_AJAX_RESPONSE:
      return {
        ...state,
        is_calling: false,
        show_snack_bar: true,
        status_text: action.status_text || ""
      };
    case constants.CALL_AJAX_ERROR:
      return {
        ...state,
        is_calling: false,
        show_snack_bar: true,
        status_text: action.status_text || ""
      };
    case constants.CALL_AJAX_CLOSE_SNACKBAR:
      return {
        ...state,
        show_snack_bar: false
      };
    default:
      return state;
  }
};

export default call_ajax;
