import {
  NOTIFICATION_BAR_HIDE_DIALOG,
  NOTIFICATION_BAR_SHOW_DIALOG
} from "./constants";

const initial_state = {
  show_bar: false
};

export default (state = { ...initial_state }, action) => {
  switch (action.type) {
    case NOTIFICATION_BAR_SHOW_DIALOG: {
      return {
        ...state,
        show_bar: true,
        level: action.level,
        title: action.title,
        content: action.content
      };
    }
    case NOTIFICATION_BAR_HIDE_DIALOG: {
      return {
        ...state,
        show_bar: false
      };
    }
    default:
      return state;
  }
};
