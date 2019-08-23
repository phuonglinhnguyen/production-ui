import { combineReducers } from 'redux';
import view from './view_reducer';
import task from './task_recducer';
import layout from './layout_reducer';
export default combineReducers({
  view,
  layout,
  task,
});
