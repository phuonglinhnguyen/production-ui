import { getDataObject } from "@dgtx/coreui";
import { delectIn, setIn, getIn } from "../utils";
import clone from 'clone'
import { getErrorRecord, getWaringRecord } from "./behavior";
import { FOCUS_FIELD_ERROR_FROM, SET_VALIDATION_LAYOUT, SET_VALIDATION_FIELD_VALUE, SET_VALIDATION_LAYOUT_VALUE, CHANGE_STATE_FROM } from "../actions";
import { checkValidationField } from "./checkValidationField";
import { checkValidationSections } from "./checkValidationSections";
import { isEqual } from "lodash";
import ValidationPool from '../../vaidationWorker'

const setValidating = (validating = true) => ({
   type: SET_VALIDATION_LAYOUT,
   payload: validating,
   meta: { resource: 'form' }
})

const checkValidated = (nextIndex, isCurrent) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let errorField = getErrorRecord({ datas: state.error, sections: state.sections })
   if (errorField) {
      console.log('====================================');
      console.log(errorField, state.fields[state.current]);
      console.log('====================================');
      let _filed = getIn(state.fields[state.current], errorField)
      if (!_filed.disable && _filed.visible && _filed.touched) {
         dispatch({
            type: FOCUS_FIELD_ERROR_FROM,
            payload: {
               active: errorField
            },
            meta: {
               resource: 'form'
            }
         })
         return false
      }
   } else {
      let waringField = getWaringRecord(state.warning)
      if (waringField) {
         let _filedW = getIn(state.fields[state.current], waringField)
         if (!_filedW.disable && _filedW.visible && _filedW.touched) {
            dispatch({
               type: CHANGE_STATE_FROM,
               payload: {
                  active: null,
                  showWarning: true,
                  isCurrent: isCurrent,
                  awaitFocus: nextIndex,
               },
               meta: {
                  resource: 'form'
               }
            })
            return false;
         }
      }

   }
   return true
}

const excChanging = () => async (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   if (state.active) {
      const element = state.elements[state.active.fieldName];
      const fieldState = getIn(state.fields[state.current], state.active);
      if (fieldState.touching) {
         element.handleChangeDebounce.flush();
      }
      if (!fieldState.touched || !isEqual(fieldState.touched, element.state.value)) {
         return await dispatch(checkValidationField({ ...state.active, value: element.state.value }));
      }
   }
   return true;
}

export const checkValidationCurrent = (nextIndex, isCurrent) => async (dispatch, getState) => {
   dispatch(setValidating())
   if (await dispatch(excChanging()) && dispatch(checkValidated(nextIndex, isCurrent))) {
      const state = getDataObject('core.resources.form.data', getState())
      let fieldsChecks = []
      let record = state.fields[state.current]
      Object.keys(record).forEach(sectionName => {
         record[sectionName].forEach((row, rowId) => {
            Object.keys(row).forEach((fieldName) => {
               let field = row[fieldName];
               if (!field.disable && field.visible) {
                  fieldsChecks.push({
                     sectionName, rowId, fieldName,
                     field,
                     value: getIn(state.value, { sectionName, rowId, fieldName }) || { text: "", words: [] }
                  })
               }
            })
         })
      })
      if (!fieldsChecks.length) {
         dispatch(setValidating(false))
         return true;
      }
      let data = await Promise.all(fieldsChecks.map(item => checkValidationFieldRun(item, state)));
      let fieldsChecked = fieldsChecks.map((fieldCheck, index) => {
         const result = {
            field: {
               sectionName: fieldCheck.sectionName,
               rowId: fieldCheck.rowId,
               fieldName: fieldCheck.fieldName,
            },
            touched: fieldCheck.value
         }
         if (data[index]) {
            if (data[index].error) {
               result.error = data[index].error
            } else {
               result.warning = data[index].warning
            }
         }
         return result
      })
      dispatch({
         type: SET_VALIDATION_LAYOUT_VALUE,
         payload: fieldsChecked,
         meta: {
            resource: 'form'
         }
      })
      // if (data.filter(Boolean).length) {
      //    dispatch(checkValidated(nextIndex, isCurrent))
      // } else
      if (dispatch(checkValidated(nextIndex, isCurrent))) {
         if (dispatch(checkValidationSections())) {
            dispatch(setValidating(false))
            return true
         }
      }
   }
   dispatch(setValidating(false))
   return false;
}


export const checkValidationFieldRun = async ({ sectionName, rowId, fieldName, field, value }, state) => {
   const { validate, pattern } = field;
   if (pattern) {
      let valueText = ((value && value.text) || '').trim();
      let patternError = pattern(valueText);
      if (patternError) {
         return {
            error: [{
               type: 'error',
               message: patternError
            }]
         }
      }
   }
   if (validate) {
      let valueText = ((value && value.text) || '').trim();
      const section = getIn(state.value, { sectionName });
      const record = getIn(state.value, { sectionName, rowId });
      let validateEx;
      try {
         let dataExtract = state.dataExtract || {};
         validateEx = ValidationPool.sendMessage({
            id: `${sectionName}-${rowId}-${fieldName}`,
            body: {
               value: valueText,
               current: state.current,
               rowId,
               record,
               section,
               layout: state.value,
               validation: validate,
               dataExtractField: dataExtract[fieldName],
               dataExtract,
            }
         })
         let validateResult = await validateEx;
         if (validateResult.type === 'abort') return;
         if (validateResult.type === 'error') return;
         if (Array.isArray(validateResult.body) && validateResult.body.length) {
            let errorField = [];
            let warningField = [];
            const destrucError = (item) => {
               if (item.type === 'error') {
                  errorField.push(item)
               } else {
                  warningField.push(item)
               }
            }
            Array.isArray(validateResult.body) && validateResult.body.forEach(destrucError);
            if (errorField.length) {
               return {
                  error: errorField
               }
            } else if (warningField.length) {
               return {
                  warning: { datas: warningField, value: (value && value.text) }
               }
            }
         }
      } catch (error) {
         return;
      }
   }
   return;
}


// export const checkValidationRecord = (props) => {
//    let {
//        error,
//        warning,
//        field,
//        value } = props;
//    Object.keys(field).forEach(sectionName => {
//        checkValidationSection({
//            errors: error,
//            warnings: warning,
//            layoutData: value,
//            fields: field[sectionName],
//            section: getDataObject([sectionName], value),
//            sectionName
//        })
//    })
// }



