import { DATA_VIEWER_OPEN_IMAGE_VIEWER } from '../constants/data_viewer_constant';

const openCloseImageViewer = (state, s2_url, doc_name) => dispatch => {
  return dispatch({
    type: DATA_VIEWER_OPEN_IMAGE_VIEWER,
    open: state,
    s2_url,
    doc_name
  });
};

export { openCloseImageViewer };
