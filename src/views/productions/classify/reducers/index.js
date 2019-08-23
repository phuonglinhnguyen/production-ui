import { combineReducers } from "redux";
import classify_single from "./classify_single_reducer";
import classify_multiple from "./classify_multiple_reducer";
import classify_verify from "./classify_verify_reducer";
import layout_definitions from "./layout_definitions_reducer";

export default combineReducers({
  classify_single,
  classify_verify,
  classify_multiple,
  layout_definitions
});
