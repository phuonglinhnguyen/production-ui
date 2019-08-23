import {
  INVOICE_OPEN_DETAIL_DIALOG,
  INVOICE_CLOSE_DETAIL_DIALOG
} from '../constants/invoice_constant';

const openDetailDialog = (type, reason) => dispatch => {
  return dispatch({
    type: INVOICE_OPEN_DETAIL_DIALOG,
    type_detail: type,
    reason: reason
  });
};

const closeDetailDialog = () => dispatch => {
  return dispatch({
    type: INVOICE_CLOSE_DETAIL_DIALOG
  });
};

export { openDetailDialog, closeDetailDialog };
