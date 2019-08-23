import {
  CLASSIFY_RESET_STATE_LAYOUT_DEFINITION,
  CLASSIFY_SET_TEXT_SEARCH_LAYOUT_DEFINITIONS,
  CLASSIFY_REQUEST_LAYOUT_DEFINITIONS,
  CLASSIFY_RESPONSE_LAYOUT_DEFINITIONS,
  CLASSIFY_ERROR_LAYOUT_DEFINITIONS
} from "../constants/classify_constants";

const initialState = {
  text_search: "",
  is_fetching: false,
  datas: []
};

const layout_definition = (state = initialState, action) => {
  switch (action.type) {
    case CLASSIFY_SET_TEXT_SEARCH_LAYOUT_DEFINITIONS:
      return { ...state, text_search: action.text_search };
    case CLASSIFY_REQUEST_LAYOUT_DEFINITIONS:
      return { ...state, is_fetching: true };
    case CLASSIFY_RESPONSE_LAYOUT_DEFINITIONS:
      return { ...state, is_fetching: false, datas: action.datas };
    case CLASSIFY_ERROR_LAYOUT_DEFINITIONS:
    case CLASSIFY_RESET_STATE_LAYOUT_DEFINITION:
      return { ...state, is_fetching: false, datas: [], text_search: "" };
    default:
      return state;
  }
};
export default layout_definition;
