import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { CHANGE_DATA_FIELD_FROM, CHANGING_DATA_FIELD_FROM } from '../actions';
import { setIn, getEffectDynamicField } from '../utils';
import { getFieldRecord } from './behavior';


export const getEffectDynamicFields = (field, { sectionName, rowId, fieldName, valueField }, valueLayout) => {
  let _value = valueField && valueField.text && valueField.text.trim() || ''
  Object.keys(field).forEach(_sectionName => {
    field[_sectionName].forEach((record, rowIdCurrent) => {
      if (record) {
        Object.keys(record).forEach(_fileName => {
          if (record[_fileName].dynamic_by_field) {
            let resultEffect = getEffectDynamicField(record[_fileName].dynamic_by_field, rowId, rowIdCurrent, valueLayout)
            record[_fileName] = { ...record[_fileName], ...resultEffect }
          }
        })
      }
    })
    // let record = field[_sectionName][rowId];
  })
}




export const handleChange = ({ sectionName, rowId, fieldName, value }) => (dispatch, getState) => {
  const state = getDataObject('core.resources.form.data', getState());
  let valueLayout = clone(state.value)
  let fields = clone(state.fields)
  setIn(valueLayout, { sectionName, rowId, fieldName }, value)
  setIn(fields[state.current], { sectionName, rowId, fieldName, key: "touching" }, null)
  if (state.isDynamic) {
    getEffectDynamicFields(fields[state.current], { sectionName, rowId, fieldName, valueField: value }, valueLayout)
    // cleanData(fields[state.current], valueLayout,state)
  }
  dispatch({
    type: CHANGE_DATA_FIELD_FROM,
    payload: {
      fields,
      value: valueLayout
    },
    meta: {
      resource: 'form'
    }
  })
}


export const handleChanging = (payload: { sectionName: string, rowId: string | number, fieldName: string, value: any }) => ({
  type: CHANGING_DATA_FIELD_FROM,
  payload,
  meta: {
    resource: 'form'
  }
})
