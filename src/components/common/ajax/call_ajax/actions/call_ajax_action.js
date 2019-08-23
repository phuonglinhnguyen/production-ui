import * as constants from "../constants/call_ajax_constants";

export const beginCall = (action_type) => ({
  type: constants.CALL_AJAX_REQUSEST,
  action_type: action_type || "Getting"
});

export const completeCall = status_text => ({
  type: constants.CALL_AJAX_RESPONSE,
  status_text: status_text || ""
});
 
export const errorCall = status_text => ({
  type: constants.CALL_AJAX_ERROR,
  status_text: status_text|| ""
});

export const closeSnackbar = status_text => ({
  type: constants.CALL_AJAX_CLOSE_SNACKBAR,
});

export const isCalling = state => state.common.ajax_call_ajax.is_calling;
