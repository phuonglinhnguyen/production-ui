import { getDataObject } from "@dgtx/coreui";
import clone from 'clone';
import { SET_DISABLE_FIELD } from "../actions";
export const changeDisableField = ({ sectionName, rowId, fieldName, isDisable }) => (dispatch, getState) => {
  const state = getDataObject('core.resources.form.data', getState())
  const fieldsNext = clone(state.fields)
  let record = fieldsNext[state.current]
  record[sectionName][rowId][fieldName].disable = isDisable

  dispatch({
    type: SET_DISABLE_FIELD,
    payload: {
      fields: fieldsNext
    },
    meta: {
      resource: 'form'
    }
  })
}