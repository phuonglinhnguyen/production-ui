import {
  CLASSIFY_VERIFY_UPDATE_NEXT_TASK,
  CLASSIFY_VERIFY_CHANGE_DISPLAY_TYPE,
  CLASSIFY_VERIFY_GET_DONE_DATA_DEFINITION,
  CLASSIFY_VERIFY_SELECT_INDEX_DOCUMENT,
  CLASSIFY_VERIFY_CHANGE_APPROVED,
  CLASSIFY_SHOW_CANVAS,
  CLASSIFY_HIDE_CANVAS,
  CLASSIFY_REQUEST_VERIFY_TASK,
  CLASSIFY_RESPONSE_VERIFY_TASK,
  CLASSIFY_VERIFY_SHOW_SNACKBAR,
  CLASSIFY_VERIFY_CLOSE_SNACKBAR,
  CLASSIFY_RESET_STATE_VERIFY_TASK_CLASSIFY,
  CLASSIFY_SAVING_VERIFY_TASK,
  CLASSIFY_VERIFY_SELECT_LAYOUT_DEFINITION,
  CLASSIFY_SAVED_ERROR_VERIFY_TASK,
  CLASSIFY_SAVED_SUCCESS_VERIFY_TASK
} from "../constants/classify_constants";

const initialState = {
  is_display_list: false,
  is_fetching_data_definitions: true,
  is_fetching_task_classify: false,
  is_saving: false,
  show_error: false,
  show_canvas: false,
  status_text: "",
  data_tasks: [],
  data_tasks_length: 0,
  next_task: true,
  selected_document: null,
  selected_index_document: -1
};

const classify_verify = (state = { ...initialState }, action) => {
  switch (action.type) {
    case CLASSIFY_VERIFY_CHANGE_DISPLAY_TYPE:
      return { ...state, is_display_list: !state.is_display_list };
    case CLASSIFY_VERIFY_GET_DONE_DATA_DEFINITION:
      return {
        ...state,
        is_fetching_data_definitions: false,
        is_display_list: action.is_display_list
      };
    case CLASSIFY_REQUEST_VERIFY_TASK:
      return { ...state, is_fetching_task_classify: true };
    case CLASSIFY_RESPONSE_VERIFY_TASK:
      return {
        ...state,
        is_fetching_task_classify: false,
        data_tasks: action.data_tasks || [],
        data_tasks_length: action.data_tasks_length || 0,
        show_error: action.show_error || false,
        status_text: action.status_text || ""
      };
    case CLASSIFY_VERIFY_UPDATE_NEXT_TASK:
      return {
        ...state,
        next_task: !state.next_task
      };
    case CLASSIFY_VERIFY_SHOW_SNACKBAR:
      return {
        ...state,
        show_error: true,
        status_text: action.status_text
      };
    case CLASSIFY_VERIFY_CLOSE_SNACKBAR:
      return {
        ...state,
        show_error: false,
        status_text: ""
      };
    case CLASSIFY_VERIFY_SELECT_LAYOUT_DEFINITION:
      return {
        ...state,
        selected_document: action.selected_document,
        data_tasks: action.data_tasks
      };
    case CLASSIFY_VERIFY_CHANGE_APPROVED:
      return {
        ...state,
        data_tasks: action.data_tasks
      };
    case CLASSIFY_VERIFY_SELECT_INDEX_DOCUMENT:
    case CLASSIFY_SHOW_CANVAS:
      return {
        ...state,
        show_canvas: action.show_canvas || false,
        selected_document: action.selected_document,
        selected_index_document: action.selected_index_document
      };
    case CLASSIFY_HIDE_CANVAS:
      return {
        ...state,
        show_canvas: false
      };
    case CLASSIFY_SAVING_VERIFY_TASK:
      return { ...state, is_saving: true };
    case CLASSIFY_SAVED_SUCCESS_VERIFY_TASK:
      return {
        ...state,
        is_saving: false,
        data_task: null,
        data_tasks: null,
        data_tasks_length: 0,
        selected_index_document: -1
      };
    case CLASSIFY_SAVED_ERROR_VERIFY_TASK:
      return {
        ...state,
        is_saving: false,
        show_error: true,
        status_text: action.status_text
      };
    case CLASSIFY_RESET_STATE_VERIFY_TASK_CLASSIFY:
      return { ...initialState };
    default:
      return state;
  }
};
export default classify_verify;
