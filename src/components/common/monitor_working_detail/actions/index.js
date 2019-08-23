import {
  CLOSE_DIALOG,
  OPEN_DIALOG,
  DID_VALIDATION,
  RECIEVE_DATA
} from "../types";
import XClient from "../../../../resources/api";
export const closeDialog = () => ({
  type: CLOSE_DIALOG
});
export const openDialog = projectId => async (dispatch, getState) => {
  dispatch({
    type: OPEN_DIALOG
  });
  try {
    let _res = await XClient.report.daily_log(projectId);
    if (_res.error) {
      dispatch({ type: DID_VALIDATION });
    } else {
      dispatch({ type: RECIEVE_DATA, payload: _res.payload });
    }
  } catch (error) {
    dispatch({ type: DID_VALIDATION });
  }
};
export default {
  closeDialog,
  openDialog
};
