import clone from 'clone'
import { getDataObject } from '@dgtx/coreui';
import { setDataRecends, setIn, analysisDynamicFields, cleanDataDynamic } from "../utils";
import { ADD_RECORD } from '../actions';
import { getFieldRecord, findFieldNextSectionMultiple, findFieldNextSectionSingle } from "./behavior";
import { checkValidationCurrent } from './checkValidationCurrent';

export const handleAddRecord = () => async (dispatch, getState) => {
  if (await dispatch(checkValidationCurrent())) {
    let { recordsTouched,
      taskId,
      current,
      error,
      errors,
      value,
      values,
      warning,
      warnings,
      sections,
      fields,
      isDynamic,
      active } = clone(getDataObject('core.resources.form.data.recordsTouched,current,error,errors,value,values,warning,warnings,taskId,sections,fields,active,isDynamic', getState()))
    errors[current] = error
    cleanDataDynamic(fields[current],value)
    values[current] = value 
    warnings[current] = warning
    setDataRecends(taskId, values);
    let field = getFieldRecord(sections)
    values.splice(current + 1, 0, {});
    errors.splice(current + 1, 0, {});
    warnings.splice(current + 1, 0, {});
    fields.splice(current + 1, 0, field);

    let props = { sectionName: sections[0].name, rowId: 0, sections, fields: field, sectionId: 0, fieldId: -1, goto: 'down' };
    let { fieldNext } = sections[0].is_multiple ? findFieldNextSectionMultiple(props) : findFieldNextSectionSingle(props);
    if(isDynamic){ analysisDynamicFields([fields[current + 1]], [values[current + 1]])}
    dispatch({
      type: ADD_RECORD,
      payload: {
        active:fieldNext,
        value: {},
        error: {},
        warning: {},
        errors,
        values,
        warnings,
        fields,
        current: current + 1,
        recordsTouched: { ...recordsTouched, [current + 1]: true }

      },
      meta: {
        resource: 'form'
      }
    })
  }
}