import { getDataObject, showNotification } from "@dgtx/coreui";

export const checkTouchedAllRecords = (props, showMessage = true) => (dispatch, getState) => {
   const state = props || getDataObject('core.resources.form.data', getState());
   if (Object.values(state.recordsTouched).filter(Boolean).length === state.values.length) {
      return true;
   }
   showMessage && dispatch(showNotification('messages.error.touched_all_records', 'error', { i18n: true, duration: 1500 }));
   return false;
}