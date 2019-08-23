import * as types from '../constants/dialog_constants';

export const setDialog = data => ({
  type: types.SET_DIALOG,
  data: data
  // open_dialog: data.open_dialog,
  // title_dialog: data.title_dialog,
  // handleClickSubmit: data.handleClickSubmit,
  // label_button_dialog: data.label_button_dialog,
  // body_dialog: data.body_dialog
});

export const resetDialog = () => ({
  type: types.RESET_DIALOG
});
