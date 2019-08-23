import clone from 'clone';

import {
  DATA_VIEWER_RECIEVE_LAYOUTS,
  DATA_VIEWER_REQUEST_LAYOUTS,
  DATA_VIEWER_RESET_LAYOUTS
} from '../constants/data_viewer_constant';

const initialState = {
  is_calling: false,

  datas: [],
  fields: [],
  header: []
};

const batch = (state = clone(initialState), action) => {
  switch (action.type) {
    case DATA_VIEWER_REQUEST_LAYOUTS:
      return {
        ...state,
        is_calling: true
      };
    case DATA_VIEWER_RECIEVE_LAYOUTS:
      return {
        ...state,
        is_calling: false,

        datas: clone(action.datas),
        fields: clone(action.fields),
        header: clone(action.header)
      };
    case DATA_VIEWER_RESET_LAYOUTS:
      return clone(initialState);
    default:
      return state;
  }
};
export default batch;
