import {
  OMR_REQUEST_TASK,
  OMR_RESPONSE_TASK,
  OMR_GET_DONE_DATA_DEFINITION,
  OMR_SAVING_TASK,
  OMR_SAVED_SUCCESS_TASK,
  OMR_SAVED_ERROR_TASK,
  OMR_RESET_STATE_TASK,
  OMR_UPDATE_NEXT_TASK,
  OMR_CLOSE_SNACKBAR
} from "../constants";

const initialState = {
  is_fetching_data_definitions: true,
  is_fetching_task_omr: false,
  is_saving: false,
  show_error: false,
  status_text: "",
  data_task: null,
  next_task: true,
  is_empty_task: true,
  section: null
};

const omr = (state = { ...initialState }, action) => {
  switch (action.type) {
    case OMR_GET_DONE_DATA_DEFINITION:
      return {
        ...state,
        is_fetching_data_definitions: false,
        section: action.section || [],
        show_error: action.show_error || false,
        status_text: action.status_text || ""
      };
    case OMR_REQUEST_TASK:
      return {
        ...state,
        show_error: false,
        status_text: "",
        is_fetching_task_omr: true
      };
    case OMR_RESPONSE_TASK:
      return {
        ...state,
        data_task: action.data_task,
        is_fetching_task_omr: false,
        is_empty_task: action.is_empty_task || false,
        show_error: action.show_error || false,
        status_text: action.status_text || ""
      };
    case OMR_CLOSE_SNACKBAR:
      return {
        ...state,
        show_error: false,
        status_text: ""
      };
    case OMR_SAVING_TASK:
      return { ...state, is_saving: true };
    case OMR_SAVED_SUCCESS_TASK:
      return {
        ...state,
        is_empty_task: true,
        is_saving: false,
        data_task: null
      };
    case OMR_SAVED_ERROR_TASK:
      return {
        ...state,
        is_saving: false,
        show_error: true,
        status_text: action.status_text
      };
    case OMR_UPDATE_NEXT_TASK:
      return {
        ...state,
        next_task: !state.next_task
      };
    case OMR_RESET_STATE_TASK:
      return { ...initialState };
    default:
      return state;
  }
};
export default omr;
