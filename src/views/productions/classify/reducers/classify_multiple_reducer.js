import {
  CLASSIFY_MULTIPLE_UPDATE_NEXT_TASK,
  CLASSIFY_MULTIPLE_CHANGE_DISPLAY_TYPE,
  CLASSIFY_MULTIPLE_GET_DONE_DATA_DEFINITION,
  CLASSIFY_MULTIPLE_SELECT_INDEX_DOCUMENT,
  CLASSIFY_SHOW_CANVAS,
  CLASSIFY_HIDE_CANVAS,
  CLASSIFY_REQUEST_MULTIPLE_TASK,
  CLASSIFY_RESPONSE_MULTIPLE_TASK,
  CLASSIFY_MULTIPLE_SHOW_SNACKBAR,
  CLASSIFY_MULTIPLE_CLOSE_SNACKBAR,
  CLASSIFY_RESET_STATE_MULTIPLE_TASK_CLASSIFY,
  CLASSIFY_SAVING_MULTIPLE_TASK,
  CLASSIFY_MULTIPLE_SELECT_LAYOUT_DEFINITION,
  CLASSIFY_SAVED_ERROR_MULTIPLE_TASK,
  CLASSIFY_SAVED_SUCCESS_MULTIPLE_TASK
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

const classify_multiple = (state = { ...initialState }, action) => {
  switch (action.type) {
    case CLASSIFY_MULTIPLE_CHANGE_DISPLAY_TYPE:
      return { ...state, is_display_list: !state.is_display_list };
    case CLASSIFY_MULTIPLE_GET_DONE_DATA_DEFINITION:
      return {
        ...state,
        is_fetching_data_definitions: false,
        is_display_list: action.is_display_list
      };
    case CLASSIFY_REQUEST_MULTIPLE_TASK:
      return { ...state, is_fetching_task_classify: true };
    case CLASSIFY_RESPONSE_MULTIPLE_TASK:
      return {
        ...state,
        is_fetching_task_classify: false,
        data_tasks: action.data_tasks || [],
        data_tasks_length: action.data_tasks_length || 0,
        show_error: action.show_error || false,
        status_text: action.status_text || ""
      };
    case CLASSIFY_MULTIPLE_UPDATE_NEXT_TASK:
      return {
        ...state,
        next_task: !state.next_task
      };
    case CLASSIFY_MULTIPLE_SHOW_SNACKBAR:
      return {
        ...state,
        show_error: true,
        status_text: action.status_text
      };
    case CLASSIFY_MULTIPLE_CLOSE_SNACKBAR:
      return {
        ...state,
        show_error: false,
        status_text: ""
      };
    case CLASSIFY_MULTIPLE_SELECT_LAYOUT_DEFINITION:
      return {
        ...state,
        selected_document: action.selected_document,
        data_tasks: action.data_tasks
      };
    case CLASSIFY_MULTIPLE_SELECT_INDEX_DOCUMENT:
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
    case CLASSIFY_SAVING_MULTIPLE_TASK:
      return { ...state, is_saving: true };
    case CLASSIFY_SAVED_SUCCESS_MULTIPLE_TASK:
      return {
        ...state,
        is_saving: false,
        data_task: null,
        data_tasks: null,
        data_tasks_length: 0,
        selected_index_document: -1
      };
    case CLASSIFY_SAVED_ERROR_MULTIPLE_TASK:
      return {
        ...state,
        is_saving: false,
        show_error: true,
        status_text: action.status_text
      };
    case CLASSIFY_RESET_STATE_MULTIPLE_TASK_CLASSIFY:
      return { ...initialState };
    default:
      return state;
  }
};
export default classify_multiple;
