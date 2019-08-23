import { getDataObject, showNotification } from "@dgtx/coreui";
import { ErrorSection } from "../ErrorSection";
import { isEqual } from "lodash";
import { CHANGE_STATE_FROM } from "../actions";

export const checkValidationSections = () => (dispatch, getState) => {
   const { validationSections, value, current, values, sections, warningSections, dataExtract } = getDataObject('core.resources.form.data', getState())
   let sectionNames = Object.keys(validationSections)
   if (sectionNames.length) {
      let errors = [];
      let warnings = [];
      sectionNames.forEach(sectionName => {
         let validationData = (typeof validationSections[sectionName] === 'function') ? validationSections[sectionName](value[sectionName], value, dataExtract) : null;
         // dispatch(showNotification(JSON.stringify(value[sectionName],null,4), 'error', { i18n: false, contentType: "custom" }))
         let _error = [];
         let _warnings = [];
         if (validationData) {
            validationData.forEach(item => {
               if (item.type === 'error') {
                  _error.push(item)
               } else {
                  _warnings.push(item)
               }
            })
         }
         if (_error.length) {
            errors.push({
               datas: _error,
               section: sectionName
            })
         }
         if (_warnings.length) {
            warnings.push({
               datas: _warnings,
               section: sectionName
            })
         }
      })
      if (errors.length) {
         dispatch(showNotification(ErrorSection(errors), 'error', { i18n: false, contentType: "custom" }))
         return false;
      } else if (warnings.length) {
         if (!warningSections[current] || !isEqual(warningSections[current].value, value) || !warningSections[current].ignore) {
            warningSections[current] = {
               warnings,
               value,
            }
            dispatch({
               type: CHANGE_STATE_FROM,
               payload: {
                  warningSections,
                  showWarningSection: true
               },
               meta: {
                  resource: 'form'
               }
            })
            return false
         }
      }
      return true;
   }
}