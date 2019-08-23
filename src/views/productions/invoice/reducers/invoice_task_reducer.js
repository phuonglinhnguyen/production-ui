import clone from 'clone';
import {
  INVOICE_DONE_CLAIM_TASK,
  INVOICE_DONE_CLAIM_TASK_ERROR,
  INVOICE_DONE_SAVE_TASK,
  INVOICE_REQUEST_CLAIM_TASK,
  INVOICE_SAVING_TASK,
  INVOICE_TASK_RESET_STATE,
  INVOICE_UPDATE_GET_NEXT_TASK
} from '../constants/invoice_constant';

const initialState = {
  is_claimming_task: false,
  is_empty_state: true,
  is_next_task: true,
  is_saving: false
};

const section_definition = (state = clone(initialState), action) => {
  switch (action.type) {
    case INVOICE_UPDATE_GET_NEXT_TASK:
      return {
        ...state,
        is_next_task: !state.is_next_task
      };
    case INVOICE_REQUEST_CLAIM_TASK:
      return {
        ...state,
        is_claimming_task: true
      };
    case INVOICE_DONE_CLAIM_TASK:
      return {
        ...state,
        is_claimming_task: false,
        is_empty_state: false
      };
    case INVOICE_DONE_CLAIM_TASK_ERROR:
      return {
        ...state,
        is_claimming_task: false
      };
    case INVOICE_SAVING_TASK:
      return {
        ...state,
        is_saving: true
      };
    case INVOICE_DONE_SAVE_TASK:
      return {
        ...state,
        is_saving: false
      };
    case INVOICE_TASK_RESET_STATE:
      return clone(initialState);
    default:
      return state;
  }
};
export default section_definition;
