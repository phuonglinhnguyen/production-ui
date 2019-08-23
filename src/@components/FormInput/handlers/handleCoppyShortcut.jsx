import { getDataObject } from "@dgtx/coreui";

export const handleCoppyShortcut = (fieldState, callback) => (dispatch, getState) => {
   let _value;
   let { value } = getDataObject('form.data', getState().core.resources);
   _value = getDataObject([fieldState.sectionName, fieldState.rowId, fieldState.fieldName], value)
   if (_value) {
     callback(_value.text)
   } else {
     Object.values(value).forEach(data => {
       if (data[0] && data[0][fieldState.fieldName]) {
         _value = data[0] && data[0][fieldState.fieldName]
       }
     })
     if (_value) {
       callback(_value.text)
     } else {
       callback('')
     }
   }
 }