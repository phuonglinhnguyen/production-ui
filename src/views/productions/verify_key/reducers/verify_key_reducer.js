import {
  VERIFY_KEY_DONE_GET_FIELDS_DEFINITION,
  VERIFY_KEY_MODIFY_FINAL_DATA,
  VERIFY_KEY_RECIEVE_TASK,
  VERIFY_KEY_REQUEST_TASK,
  VERIFY_KEY_RESET_STATE,
  VERIFY_KEY_SAVED_SUCCESS_TASK,
  VERIFY_KEY_SAVING_TASK,
  VERIFY_KEY_SET_FOCUS_FIELD,
  VERIFY_KEY_SET_FOCUS_RECORD,
  VERIFY_KEY_UPDATE_ERROR_DOCUMENT,
  VERIFY_KEY_UPDATE_NEXT_TASK
} from '../constants/verify_key_contants';

const initialLocation = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

const initialState = {
  data_document: [{}],
  data_final: [{}],
  doc_info: null,
  error_document: [{}],
  focus_field_name: '',
  focus_record: 0,
  is_empty_state: true,
  is_fetch_field_definitions: true,
  is_fetching_task: false,
  is_next_task: true,
  is_render: false,
  is_saving: false,
  positions: { ...initialLocation }
};

const verify_key = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_KEY_DONE_GET_FIELDS_DEFINITION:
      return { ...state, is_fetch_field_definitions: false };
    case VERIFY_KEY_REQUEST_TASK:
      return { ...state, is_fetching_task: true };
    case VERIFY_KEY_RECIEVE_TASK:
      return {
        ...state,
        data_document: [...action.data_document],
        data_final: [...action.data_final],
        doc_info: action.doc_info,
        error_document: [...action.error_document],
        is_empty_state: action.is_empty_state,
        is_fetching_task: false
      };
    case VERIFY_KEY_MODIFY_FINAL_DATA:
      return {
        ...state,
        data_final: [...action.data_final]
      };
    case VERIFY_KEY_UPDATE_ERROR_DOCUMENT:
      return {
        ...state,
        error_document: [...action.error_document]
      };
    case VERIFY_KEY_SAVING_TASK:
      return { ...state, is_saving: true };
    case VERIFY_KEY_SAVED_SUCCESS_TASK:
      return {
        ...state,
        data_document: [{}],
        data_final: [{}],
        doc_info: null,
        focus_field_name: '',
        focus_record: 0,
        is_empty_state: true,
        is_saving: false
      };
    case VERIFY_KEY_UPDATE_NEXT_TASK:
      return {
        ...state,
        is_next_task: !state.is_next_task
      };
    case VERIFY_KEY_SET_FOCUS_RECORD:
      return {
        ...state,
        focus_field_name: action.focus_field_name,
        focus_record: action.focus_record,
        positions: action.positions
      };
    case VERIFY_KEY_SET_FOCUS_FIELD:
      return {
        ...state,
        focus_field_name: action.focus_field_name,
        is_render: action.is_render,
        positions: action.positions || { ...initialLocation }
      };
    case VERIFY_KEY_RESET_STATE:
      return { ...initialState };
    default:
      return state;
  }
};
export default verify_key;
