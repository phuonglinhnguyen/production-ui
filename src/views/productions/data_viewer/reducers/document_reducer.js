import clone from 'clone';
import {
  DATA_VIEWER_REQUEST_TASK,
  DATA_VIEWER_RECIEVE_TASKS,
  DATA_VIEWER_OPEN_IMAGE_VIEWER,
  DATA_VIEWER_RECIEVE_TASKS_ERROR,
  DATA_VIEWER_RESET_TASKS
} from '../constants/data_viewer_constant';

const initialState = {
  is_calling: false,
  is_error: false,

  datas: [],

  document_selected: {},
  record_index: 0,

  show_image: false,
  s2_url: [],
  doc_name : []
};

const document = (state = clone(initialState), action) => {
  switch (action.type) {
    case DATA_VIEWER_REQUEST_TASK:
      return {
        ...state,
        is_calling: true,
        show_image: false
      };
    case DATA_VIEWER_RECIEVE_TASKS_ERROR:
      return {
        ...state,
        datas: [],
        is_calling: false,
        is_error: true
      };
    case DATA_VIEWER_RECIEVE_TASKS:
      return {
        ...state,
        datas: clone(action.datas),
        is_calling: false,
        is_error: false
      };
    case DATA_VIEWER_OPEN_IMAGE_VIEWER:
      return {
        ...state,
        show_image: action.open,
        s2_url: clone(action.s2_url),
        doc_name : clone(action.doc_name)
      };
    case DATA_VIEWER_RESET_TASKS:
      return clone(initialState);
    default:
      return state;
  }
};
export default document;
