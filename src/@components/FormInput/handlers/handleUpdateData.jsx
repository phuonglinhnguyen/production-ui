import { checkValidationCurrent } from "./checkValidationCurrent";
import { setDataRecends, cleanDataDynamic } from "../utils";
import { getDataObject } from "@dgtx/coreui";
import clone from 'clone'
import { UPDATE_CURRENT_DATA_FROM } from "../actions";

export const handleUpdateData = () => async(dispatch, getState) => {
   let { fields, taskId, current, error, errors, value, values, warning, warnings } = clone(getDataObject('core.resources.form.data.current,error,errors,value,values,warning,warnings,taskId,fields', getState()))
   cleanDataDynamic(fields[current],value)
   if (await dispatch(checkValidationCurrent())) {
      errors[current] = error
      values[current] = value
      warnings[current] = warning
      setDataRecends(taskId, values)
      dispatch({
         type: UPDATE_CURRENT_DATA_FROM,
         payload: {
            errors,
            values,
            warnings
         },
         meta: {
            resource: 'form'
         }
      })
   }
}