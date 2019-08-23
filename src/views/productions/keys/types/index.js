import { NAMESPACE_MODULE } from '../constants';
import * as _view from './view_types';
import _tasks from './task_types';
import _layouts from './layout_types';

export const ViewTypes = _view;
export const TaskTypes = _tasks;
export const LayoutTypes = _layouts;
export const RESET_ALL = `${NAMESPACE_MODULE}_RESET_ALL`;

export default {
  ViewTypes,
  TaskTypes,
  LayoutTypes,
  RESET_ALL,
};
