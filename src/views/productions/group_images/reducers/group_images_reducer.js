import * as types from "../constants/group_images_constants";
import clone from "clone";

const initialState = {
  next: true,
  is_empty: true,
  is_getting: false,
  is_saving: false,

  is_show_canvas: false,

  is_show_error: false,
  status_text: "",

  datas: [],
  groups: []
};

const group_images = (state = clone(initialState), action) => {
  switch (action.type) {
    case types.GROUP_IMAGES_CHANGE_NEXT:
      return {
        ...state,
        next: !state.next
      };
    case types.GROUP_IMAGES_GET_TASK:
      return {
        ...state,
        is_getting: true
      };
    case types.GROUP_IMAGES_SET_TASK:
      return {
        ...state,
        is_getting: false,
        is_empty: action.is_empty,
        is_show_error: action.is_show_error || false,
        datas: action.data_tasks,
        complete_reason: action.complete_reason,
        show_error: action.show_error || false,
        status_text: action.status_text || ""
      };
    case types.GROUP_IMAGES_CHECK_IMAGE:
      return {
        ...state,
        datas: action.datas,
        groups: action.groups || []
      };
    case types.GROUP_IMAGES_SELECT_REASON:
    case types.GROUP_IMAGES_CHANGE_BARCODE:
      return {
        ...state,
        groups: action.groups
      };
    case types.GROUP_IMAGES_VALID:
    case types.GROUP_IMAGES_SHOW_SNACKBAR:
    case types.GROUP_IMAGES_SAVE_ERROR:
      return {
        ...state,
        is_show_error: true,
        is_saving: false,
        status_text: action.status_text
      };
    case types.GROUP_IMAGES_CLOSE_SNACKBAR:
      return {
        ...state,
        is_show_error: false,
        status_text: ""
      };
    case types.GROUP_IMAGES_SHOW_CANVAS:
      return {
        ...state,
        is_show_canvas: true,
        image_name: action.image_name,
        image_s3: action.image_s3
      };
    case types.GROUP_IMAGES_HIDE_CANVAS:
      return {
        ...state,
        is_show_canvas: false
      };
    case types.GROUP_IMAGES_SAVING:
      return {
        ...state,
        is_saving: true
      };
    case types.GROUP_IMAGES_SAVE_SUCCESS:
      return {
        ...state,
        is_saving: false,
        is_empty: true,
        groups: [],
        datas: null
      };
    case types.GROUP_IMAGES_RESET_STATE:
      return clone(initialState);
    default:
      return state;
  }
};
export default group_images;
