import { getDataObject } from "@dgtx/coreui";
import clone from 'clone'
import { checkValidationCurrent } from "./checkValidationCurrent";
import { checkTouchedAllRecords } from "./checkTouchedAllRecords";
import { cleanDataDynamic } from "../utils";
const getData = ({ values, fields, sections }) => {
   let sectionMap = {};
   sections.forEach(item => { sectionMap[item.name] = item; })
   let dataTransform = [];
   let dataUser = [];
   values.forEach((_values, current) => {
      let _dataTransform = {};
      let _dataUser = {};
      let fieldCurrent = fields[current]
      cleanDataDynamic(fieldCurrent, _values)
      Object.keys(fieldCurrent).forEach(sectionName => {
         if (sectionName) {
            let _recordsField = fieldCurrent[sectionName];
            let _records = _values[sectionName] || []
            let _dataUserRecords = []
            if (sectionMap[sectionName].settings.autoIncrement) {
               let _fieldId = sectionMap[sectionName].settings.fieldId;
               _dataTransform[sectionName] = _recordsField.map((recordField, rowId) => {
                  let _record = _records[rowId] || {};
                  let _dataTransformRecord = {};
                  let _dataUserRecord = {};
                  Object.keys(recordField).forEach(fieldName => {
                     if (fieldName) {
                        let _valField = _record[fieldName] || { text: '', words: [] };
                        if (fieldName === _fieldId) {
                           _valField = { text: (sectionMap[sectionName].settings.autoIncrement === "section" ? rowId : current) + Number(sectionMap[sectionName].settings.autoIncrementStart), words: [] }
                        }
                        _dataUserRecord[fieldName] = _valField
                        if (recordField[fieldName].transform) {
                           _dataTransformRecord[fieldName] = {
                              text: recordField[fieldName].transform(_valField.text, rowId, _record, {}, _values),
                              words: _valField.words,
                           }
                        } else {
                           _dataTransformRecord[fieldName] = _valField
                        }
                     }
                  })
                  _dataUserRecords.push(_dataUserRecord);
                  return _dataTransformRecord
               })
            } else {
               _dataTransform[sectionName] = _recordsField.map((recordField, rowId) => {
                  let _record = _records[rowId] || {};
                  let _dataTransformRecord = {};
                  let _dataUserRecord = {};
                  Object.keys(recordField).forEach(fieldName => {
                     if (fieldName) {
                        let _valField = _record[fieldName] || { text: '', words: [] };
                        _dataUserRecord[fieldName] = _valField
                        if (recordField[fieldName].transform) {
                           _dataTransformRecord[fieldName] = {
                              text: recordField[fieldName].transform(_valField.text, rowId, _record, {}, _values),
                              words: _valField.words,
                           }
                        } else {
                           _dataTransformRecord[fieldName] = _valField
                        }
                     }
                  })
                  _dataUserRecords.push(_dataUserRecord);
                  return _dataTransformRecord
               })
            }
            _dataUser[sectionName] = _dataUserRecords
         }
      })
      dataUser.push(_dataUser)
      dataTransform.push(_dataTransform)
   })
   return {
      dataUser,
      dataTransform,
      sections: sections.map(item => item.name)
   }
}



export const getDataForm = ({ isIgnoreWarning = false, isIgnoreError = false }) => async (dispatch, getState) => {
   let state = getState()
   const data = getDataObject('core.resources.form.data', state);
   if (isIgnoreError) {
      let { current, value, values } = data;
      values[current] = value;
      const results = getData(data);
      return getData(data);
   } else {
      if (dispatch(checkTouchedAllRecords(data))) {
         let isChecked = await dispatch(checkValidationCurrent());
         if (isChecked) {
            let { current, value, values } = data;
            values[current] = value;
            const results = getData(data);
            return results;
         }
      }
   }
   return null;
}