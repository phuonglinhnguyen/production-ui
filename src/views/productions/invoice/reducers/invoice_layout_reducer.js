import clone from 'clone';
import {
  INVOICE_RECEIVE_LAYOUT_DEFINITION,
  INVOICE_REQUEST_LAYOUT_DEFINITION,
  INVOICE_RESET_LAYOUT_DEFINITION
} from '../constants/invoice_constant';

const initialState = {
  datas: [],
  is_calling: false,
  should_get_layout: true,
  section_name: [],
  fields: []
};

const section_definition = (state = clone(initialState), action) => {
  switch (action.type) {
    case INVOICE_REQUEST_LAYOUT_DEFINITION:
      return { ...state, is_calling: true };
    case INVOICE_RECEIVE_LAYOUT_DEFINITION:
      return {
        ...state,
        datas: [...action.datas],
        fields: [...action.fields],
        section_name: clone(action.section_name),
        is_calling: false,
        should_get_layout: false
      };
    case INVOICE_RESET_LAYOUT_DEFINITION:
      return clone(initialState);
    default:
      return state;
  }
};
export default section_definition;
