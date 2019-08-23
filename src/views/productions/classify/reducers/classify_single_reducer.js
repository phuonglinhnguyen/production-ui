import {
  CLASSIFY_SINGLE_GET_DONE_DATA_DEFINITION,
  CLASSIFY_REQUEST_SINGLE_TASK,
  CLASSIFY_RESPONSE_SINGLE_TASK,
  CLASSIFY_SINGLE_SHOW_SNACKBAR,
  CLASSIFY_SINGLE_CLOSE_SNACKBAR,
  CLASSIFY_RESET_STATE_TASK_CLASSIFY,
  CLASSIFY_SINGLE_SELECT_LAYOUT_DEFINITION,
  CLASSIFY_SAVING_SINGLE_TASK,
  CLASSIFY_SAVED_SUCCESS_SINGLE_TASK,
  CLASSIFY_SAVED_ERROR_SINGLE_TASK,
  CLASSIFY_SINGLE_UPDATE_NEXT_TASK
} from "../constants/classify_constants";

const initialState = {
  is_fetching_data_definitions: true,
  is_fetching_task_classify: false,
  is_saving: false,
  show_error: false,
  status_text: "",
  data_task: null,
  next_task: true,
  is_empty_task: true,
  selected_layout_definition: null
};

const classify_single = (state = { ...initialState }, action) => {
  switch (action.type) {
    case CLASSIFY_SINGLE_GET_DONE_DATA_DEFINITION:
      return { ...state, is_fetching_data_definitions: false };
    case CLASSIFY_REQUEST_SINGLE_TASK:
      return {
        ...state,
        show_error: false,
        status_text: "",
        is_fetching_task_classify: true
      };
    case CLASSIFY_RESPONSE_SINGLE_TASK:
      return {
        ...state,
        is_fetching_task_classify: false,
        data_task: action.data_task || null,
        is_empty_task: action.is_empty_task || false,
        show_error: action.show_error || false,
        status_text: action.status_text || ""
      };
    case CLASSIFY_SINGLE_SHOW_SNACKBAR:
      return {
        ...state,
        show_error: true,
        status_text: action.status_text
      };
    case CLASSIFY_SINGLE_CLOSE_SNACKBAR:
      return {
        ...state,
        show_error: false,
        status_text: ""
      };
    case CLASSIFY_SINGLE_SELECT_LAYOUT_DEFINITION:
      return {
        ...state,
        selected_layout_definition: action.selected_layout_definition
      };
    case CLASSIFY_SAVING_SINGLE_TASK:
      return { ...state, is_saving: true };
    case CLASSIFY_SAVED_SUCCESS_SINGLE_TASK:
      return {
        ...state,
        is_empty_task: true,
        is_saving: false,
        data_task: null,
        selected_layout_definition: null
      };
    case CLASSIFY_SAVED_ERROR_SINGLE_TASK:
      return {
        ...state,
        is_saving: false,
        show_error: true,
        status_text: action.status_text
      };
    case CLASSIFY_SINGLE_UPDATE_NEXT_TASK:
      return {
        ...state,
        next_task: !state.next_task
      };
    case CLASSIFY_RESET_STATE_TASK_CLASSIFY:
      return { ...initialState };
    default:
      return state;
  }
};
export default classify_single;
