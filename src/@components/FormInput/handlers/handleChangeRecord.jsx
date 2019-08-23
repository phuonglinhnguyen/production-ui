import { setDataRecends, cleanDataDynamic } from "../utils";
import { delectIn, setIn, getIn } from "../utils";
import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { findFieldNextSectionMultiple, findFieldNextSectionSingle } from "./behavior";
import { CHANGE_NEXT_FROM } from "../actions";
import { checkValidationCurrent } from "./checkValidationCurrent";

export const nextRecord = (nextIndex, warningCurrent, isCurrent) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let warning = warningCurrent || clone(state.warning);
   let warnings = clone(state.warnings);
   let sections = state.sections
   let values = clone(state.values);
   let value = clone(state.value);
   cleanDataDynamic(state.fields[state.current],value);
   values[state.current] = value
   warnings[state.current] = warning;
   setDataRecends(state.taskId, values)
   if (state.values[nextIndex]) {
      let fieldNext = state.active;
      if (!isCurrent) {
         let props = { sectionName: sections[0].name, rowId: 0, sections, fields: state.fields, sectionId: 0, fieldId: -1, goto: 'down' };
         let nextData = sections[0].is_multiple ? findFieldNextSectionMultiple(props) : findFieldNextSectionSingle(props);
         fieldNext = nextData.fieldNext
      }
      dispatch({
         type: CHANGE_NEXT_FROM,
         payload: {
            focusSubmit: false,
            showWarning: false,
            value: clone(values[nextIndex]||{}),
            error:{},
            values,
            warning: clone(warnings[nextIndex]||{}),
            warnings,
            current: nextIndex,
            recordsTouched: { ...clone(state.recordsTouched), [nextIndex]: true },
            active: fieldNext
         },
         meta: {
            resource: 'form'
         }
      })
   } else {
      dispatch({
         type: CHANGE_NEXT_FROM,
         payload: {
            warning: warning,
            values,
            warnings,
            focusSubmit: false,
            showWarning: false,
            // active: null,
         },
         meta: {
            resource: 'form'
         }
      })
   }
}




export const handleChangeRecord = (nextIndex, isCurrent = true) => async (dispatch, getState) => {
   let hasNext = await dispatch(checkValidationCurrent(nextIndex, isCurrent));
   if (hasNext) {
      dispatch(nextRecord(nextIndex, null, isCurrent))
   }
}