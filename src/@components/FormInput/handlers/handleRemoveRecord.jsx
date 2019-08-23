import clone from 'clone'
import { getDataObject } from '@dgtx/coreui';
import { setDataRecends, setIn } from '../utils';
import { findFieldNextSectionMultiple, findFieldNextSectionSingle } from './behavior';
import { REMOVE_RECORD } from '../actions';

export const handleRemoveRecord = (isCurrent = true) => (dispatch, getState) => {
   let { recordsTouched, taskId, current, error, errors, value, values, warning, warnings, sections, fields, active } = clone(getDataObject('core.resources.form.data.recordsTouched,current,error,errors,value,values,warning,warnings,taskId,sections,fields,active', getState()))
   let _recordsTouched = {};
   for (let index = 0; index < current; index++) {
      if (recordsTouched[index]) {
         _recordsTouched[index] = true;
      }
   }
   for (let index = current; index < fields.length; index++) {
      if (recordsTouched[index + 1]) {
         _recordsTouched[index] = true;
      }
   }
   if (fields.length > 1) {
      errors.splice(current, 1);
      values.splice(current, 1);
      fields.splice(current, 1);
      warnings.splice(current, 1);
      if (!fields[current]) {
         current = current - 1;
      }
      error = clone(errors[current]) || {};
      value = clone(values[current]) || {};
      warning = clone(warnings[current]) || {};
      setDataRecends(taskId, values)
      if (!isCurrent) {
         let props = { sectionName: sections[0].name, rowId: 0, sections, fields: fields[current], sectionId: 0, fieldId: -1, goto: 'down' };
         let { fieldNext } = sections[0].is_multiple ? findFieldNextSectionMultiple(props) : findFieldNextSectionSingle(props);
         setIn(fields[current], { ...fieldNext, key: 'active' }, true);
         if (active) {
            setIn(fields[current], { ...active, key: 'touched' }, true);
            setIn(fields[current], { ...active, key: 'active' }, false);
         }
      }
      dispatch({
         type: REMOVE_RECORD,
         payload: {
            value,
            error,
            warning,
            errors,
            values,
            warnings,
            fields,
            current,
            recordsTouched: _recordsTouched
         },
         meta: {
            resource: 'form'
         }
      })
   }
}