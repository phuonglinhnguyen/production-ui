import clone from 'clone';

import {
  DATA_VIEWER_RECIEVE_BATCHES,
  DATA_VIEWER_SELECT_BATCH,
  DATA_VIEWER_SELECT_STEP,
  DATA_VIEWER_RECIEVE_BATCHES_ERROR,
  DATA_VIEWER_RESET_BATCHES,
  DATA_VIEWER_REQUEST_BATCHES
} from '../constants/data_viewer_constant';

const initialState = {
  first_call: true,
  is_err: false,
  is_calling: false,
  step: 0,

  datas: [],
  batch_selected: null
};

const batch = (state = clone(initialState), action) => {
  switch (action.type) {
    case DATA_VIEWER_REQUEST_BATCHES:
      return {
        ...state,
        is_calling: true
      };
    case DATA_VIEWER_RECIEVE_BATCHES:
      return {
        ...state,
        datas: clone(action.datas),
        is_calling: false,
        first_call: false,
        is_err: false
      };
    case DATA_VIEWER_RECIEVE_BATCHES_ERROR:
      return {
        ...state,
        datas: [],
        first_call: false,
        is_error: true
      };
    case DATA_VIEWER_SELECT_BATCH:
      return {
        ...state,
        batch_selected: clone(action.batch_selected),
        step: 1
      };
    case DATA_VIEWER_SELECT_STEP:
      return {
        ...state,
        step: action.step
      };
    case DATA_VIEWER_RESET_BATCHES:
      return clone(initialState);
    default:
      return state;
  }
};
export default batch;
