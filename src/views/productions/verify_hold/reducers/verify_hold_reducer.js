import clone from 'clone';

import {
  VERIFY_HOLD_UPDATE_NEXT_TASK,
  VERIFY_HOLD_REQUEST_TASKS,
  VERIFY_HOLD_RECEIVE_TASKS,
  VERIFY_HOLD_SELECT_TASK,
  VERIFY_HOLD_MODIFY_TASK,
  VERIFY_HOLD_VALIDATE_ERROR,
  VERIFY_HOLD_SAVING_TASK,
  VERIFY_HOLD_SAVE_SUCCESS,
  VERIFY_HOLD_SAVE_FAILURE,
  VERIFY_HOLD_RESET_STATE,
  VERIFY_HOLD_RECEIVE_ERROR
} from '../constants/verify_hold_constant';

const initialTaskSelected = {
  task_id: '',
  batch_name: '',
  doc_uri: '',
  s2_url: '',
  hold_data: []
};

const initialState = {
  is_getting_task: false,
  is_empty_state: true,
  next_task: false,
  is_saving: false,
  /**
   * data
   */
  tasks: [{}],
  /**
   * document
   */
  task_selected: clone(initialTaskSelected),
  /**
   * TASKS
   */
  task_index_selected: -1,
  section_error: -1
};

const verify_hold = (state = clone(initialState), action) => {
  switch (action.type) {
    case VERIFY_HOLD_UPDATE_NEXT_TASK:
      return {
        ...state,
        next_task: !state.next_task
      };
    case VERIFY_HOLD_REQUEST_TASKS:
      return {
        ...state,
        is_getting_task: true
      };
    case VERIFY_HOLD_RECEIVE_ERROR:
      return {
        ...state,
        is_getting_task: false,
        is_empty_state: true
      };
    case VERIFY_HOLD_RECEIVE_TASKS:
      return {
        ...state,
        tasks: clone(action.tasks),
        is_empty_state: action.is_empty_state,
        is_getting_task: false
      };
    case VERIFY_HOLD_SELECT_TASK:
      return {
        ...state,
        task_index_selected: action.task_index_selected,
        task_selected: clone(action.task_selected)
      };
    case VERIFY_HOLD_MODIFY_TASK:
      return {
        ...state,
        task_selected: clone(action.task_selected),
        section_error: action.section_error
      };
    case VERIFY_HOLD_VALIDATE_ERROR:
      return {
        ...state,
        section_error: action.section_error
      };
    case VERIFY_HOLD_SAVING_TASK:
      return {
        ...state,
        is_saving: true
      };
    case VERIFY_HOLD_SAVE_SUCCESS:
      return {
        ...state,
        tasks: clone(action.tasks),
        task_index_selected: action.task_index_selected,
        task_selected: clone(action.task_selected),
        is_saving: false
      };
    case VERIFY_HOLD_SAVE_FAILURE:
      return {
        ...state,
        is_saving: false
      };
    case VERIFY_HOLD_RESET_STATE:
      return clone(initialState);
    default:
      return state;
  }
};
export default verify_hold;
