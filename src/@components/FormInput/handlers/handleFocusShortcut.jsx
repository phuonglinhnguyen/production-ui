import { getDataObject } from "@dgtx/coreui";
import clone from 'clone';
import { isEqual } from "lodash";
import { setIn, getIn } from "../utils";
import { isActive } from "./behavior";
import { ON_FOCUS_FIELD_FROM } from "../actions";

export const handleFocusShortcut = (fieldState) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let fieldCurrent = state.fields[state.current] || state.fields
   if (!isEqual(fieldState, state.active) && isActive(getIn(fieldCurrent, { ...fieldState }))) {
      dispatch({
         type: ON_FOCUS_FIELD_FROM,
         payload: {
            active: fieldState
         },
         meta: {
            resource: 'form'
         }
      })
   }
}