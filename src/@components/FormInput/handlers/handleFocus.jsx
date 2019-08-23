import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { setIn } from '../utils';
import { ON_FOCUS_FIELD_FROM } from '../actions';

export const handleOnFocus = ({ sectionName, rowId, fieldName, value }) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let fields = clone(state.fields);
   let fieldCurrent = fields[state.current] || fields
   setIn(fieldCurrent, { sectionName, rowId, fieldName , key: 'touched' }, true)
   dispatch({
     type: ON_FOCUS_FIELD_FROM,
     payload: {
       fields,
       focusSubmit: false,
       active: { sectionName, rowId, fieldName }
     },
     meta: {
       resource: 'form'
     }
   })
 }