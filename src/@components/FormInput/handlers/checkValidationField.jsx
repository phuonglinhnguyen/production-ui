import { delectIn, setIn, getIn } from "../utils";
import md5 from 'md5'
import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { ON_FOCUS_FIELD_FROM, SET_VALIDATION_FIELD, SET_VALIDATION_FIELD_VALUE } from '../actions';
import ValidationPool from '../../vaidationWorker'
import { debounce } from "../../../utils/common";

const setValidatingFieldAction = ({ sectionName, rowId, fieldName }, validating = true) => {
   return {
      type: SET_VALIDATION_FIELD,
      payload: { sectionName, rowId, fieldName, validating },
      meta: {
         resource: 'form'
      }
   }
}

const checkValidationAsync = (state, { sectionName, rowId, fieldName }, validate) => async (dispatch) => {
   if (validate instanceof Promise) {
      dispatch(setValidatingFieldAction(state, { sectionName, rowId, fieldName }))
      let result = await validate;
      dispatch(setValidatingFieldAction(state, { sectionName, rowId, fieldName }, false))
      return result;
   } else {
      return validate
   }
}

export const checkValidationField = ({ sectionName, rowId, fieldName, value }, effect = true) => async (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState());
   let _fieldData = getIn(state.fields[state.current], { sectionName, rowId, fieldName });
   if (!_fieldData) return true;
   const { validate, pattern } = _fieldData;
   let key_touched = md5(JSON.stringify(state.value))
   if (pattern) {
      let valueText = ((value && value.text) || '').trim();
      let patternError = pattern(valueText);
      if (patternError) {
         let errorField = [{
            type: 'error',
            message: patternError
         }]
         dispatch({
            type: SET_VALIDATION_FIELD_VALUE,
            payload: {
               sectionName,
               rowId,
               fieldName,
               error: errorField
            },
            meta: {
               resource: 'form'
            }
         })
         return false;
      }
   }
   if (validate) {

      if (_fieldData.touched === key_touched) {
         return true;
      }

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
      } catch (error) {
         console.log('========errorerrorerror============================');
         console.log(error);
         console.log('====================================');
      }
      // let showWaiting = debounce(()=>{dispatch(setValidatingFieldAction({ sectionName, rowId, fieldName }))})
      if (effect && !_fieldData.validating) {
         dispatch(setValidatingFieldAction({ sectionName, rowId, fieldName }))
      }
      let validateResult = await validateEx;
      if (validateResult.type === 'abort') return false;
      if (effect) {
         dispatch(setValidatingFieldAction({ sectionName, rowId, fieldName }, false));
      }
      if (validateResult.type === 'error') {
         return true;
      }
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
            dispatch({
               type: SET_VALIDATION_FIELD_VALUE,
               payload: {
                  sectionName,
                  rowId,
                  fieldName,
                  touched: key_touched,
                  error: errorField
               },
               meta: {
                  resource: 'form'
               }
            })
            return true;
         } else if (warningField.length) {
            dispatch({
               type: SET_VALIDATION_FIELD_VALUE,
               payload: {
                  sectionName,
                  rowId,
                  fieldName,
                  touched: key_touched,
                  warning: { datas: warningField, value: (value && value.text) }
               },
               meta: {
                  resource: 'form'
               }
            })
            return false;
         }
      }
   }
   dispatch({
      type: SET_VALIDATION_FIELD_VALUE,
      payload: { sectionName, rowId, fieldName, touched: key_touched },
      meta: {
         resource: 'form'
      }
   })
   return true;
}