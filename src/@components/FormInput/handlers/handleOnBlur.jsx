import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { setIn } from '../utils';
import { ON_BLUR_FIELD_FROM } from '../actions';

export const handleOnBlur = ({ sectionName, rowId, fieldName }) => (dispatch, getState) => {
  const state = getDataObject('core.resources.form.data', getState())
  let fields = clone(state.fields);
  let fieldCurrent = fields[state.current] || fields
  setIn(fieldCurrent, { sectionName, rowId, fieldName, key: 'touched' }, true)
  dispatch({
    type: ON_BLUR_FIELD_FROM,
    payload: {
      fields
    },
    meta: {
      resource: 'form'
    }
  })
}