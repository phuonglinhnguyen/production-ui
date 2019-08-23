import { combineReducers } from 'redux';
import view from './view_reducer';
import task from './task_recducer';
import layout from './layout_reducer';
import storage_field from './storage_field_reducer'
export default combineReducers({
  view,
  layout,
  task,
  storage_field
});
