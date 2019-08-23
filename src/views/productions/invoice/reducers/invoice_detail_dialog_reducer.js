import clone from 'clone';
import {
  INVOICE_OPEN_DETAIL_DIALOG,
  INVOICE_CLOSE_DETAIL_DIALOG
} from '../constants/invoice_constant';

const initialState = {
  is_open: false,
  reason: {},
  type_detail: ''
};

const section_definition = (state = clone(initialState), action) => {
  switch (action.type) {
    case INVOICE_OPEN_DETAIL_DIALOG:
      return {
        ...state,
        is_open: true,
        reason: clone(action.reason),
        type_detail: action.type_detail
      };
    case INVOICE_CLOSE_DETAIL_DIALOG:
      return {
        ...state,
        is_open: false
      };
    default:
      return state;
  }
};
export default section_definition;
