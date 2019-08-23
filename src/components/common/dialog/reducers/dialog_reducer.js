import * as types from '../constants/dialog_constants';

const initialState = {
  open_dialog: false,
  title_dialog: '',
  handleClickSubmit: null,
  body_dialog: null,
  label_button_dialog: ''
};

const dialog = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_DIALOG:
      return {
        ...state,
        ...action.data
        // open_dialog: action.open_dialog,
        // title_dialog: action.title_dialog,
        // handleClickSubmit: action.handleClickSubmit,
        // body_dialog: action.body_dialog,
        // label_button_dialog: action.label_button_dialog
      };
    case types.RESET_DIALOG:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default dialog;
