import clone from 'clone';
import {
  INVOICE_CHANGE_TEXTAREA_MODE,
  INVOICE_DOCUMENT_RESET_STATE,
  INVOICE_RECIEVE_DOCUMENT_DATA,
  INVOICE_UPDATE_ANCHOREL,
  INVOICE_UPDATE_DOCUMENT_DATA,
  INVOICE_UPDATE_FOCUS_DETAILS
} from '../constants/invoice_constant';

const initialState = {
  action_type : '',
  /**
   * documents
   */
  document_data: [{}],
  doc_info: {},
  /**
   * FOCUS
   */
  textarea_mode: false,
  anchor: null,
  record_focused: 0,
  section_focused: '',
  index_item_focused: 0,
  field_focused: '',
  complete_reason: null
};

const invoice_document = (state = clone(initialState), action) => {
  switch (action.type) {
    case INVOICE_RECIEVE_DOCUMENT_DATA:
      return {
        ...state,
        document_data: clone(action.document_data),
        doc_info: clone(action.doc_info),
        action_type : action.action_type,
        complete_reason: clone(action.complete_reason)
      };
    case INVOICE_UPDATE_DOCUMENT_DATA:
      return {
        ...state,
        document_data: clone(action.document_data)
      };
    case INVOICE_UPDATE_FOCUS_DETAILS:
      return {
        ...state,
        anchor: null,
        field_focused: action.field_focused,
        index_item_focused: action.index_item_focused,
        record_focused: action.record_focused,
        section_focused: action.section_focused,
        textarea_mode: false
      };
    case INVOICE_CHANGE_TEXTAREA_MODE:
      return {
        ...state,
        textarea_mode: action.textarea_mode,
        anchor: action.anchor
      };
    case INVOICE_UPDATE_ANCHOREL:
      return {
        ...state,
        anchor: action.anchor
      };
    case INVOICE_DOCUMENT_RESET_STATE:
      return clone(initialState);
    default:
      return state;
  }
};
export default invoice_document;
