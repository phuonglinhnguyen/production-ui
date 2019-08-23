import { getDataObject } from "@dgtx/coreui";

export const handleCoppy = (fieldState, callback) => (dispatch, getState) => {
   let value = '';
   let { values, current } = getDataObject('form.data', getState().core.resources);
   if (fieldState.rowId > 0) {
     value = getDataObject([current, fieldState.sectionName, fieldState.rowId - 1, fieldState.fieldName, 'text'], values)
   } else if (current > 0) {
     value = getDataObject([current - 1, fieldState.sectionName, fieldState.rowId, fieldState.fieldName, 'text'], values)
   }
   callback(value)
 }
 