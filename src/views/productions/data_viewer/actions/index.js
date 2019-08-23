import {
  getAllTaskAvailable,
  selectBatch,
  selectStep,
  resetState
} from './batch_action';
import { getLayouts } from './layout_action';
import { openCloseImageViewer } from './image_action';
import { saveTasks } from './task_action';
const getGenericParams = (params, username) => dispatch => {
  dispatch(getAllTaskAvailable(params, username));
  dispatch(getLayouts(params.projectId, params.action === 'invoice'));

};

export {
  getGenericParams,
  selectBatch,
  openCloseImageViewer,
  selectStep,
  resetState,
  saveTasks
};
