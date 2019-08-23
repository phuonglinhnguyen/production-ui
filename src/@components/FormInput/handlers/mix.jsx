import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { getErrorRecord, getFieldRecord, findFieldNextSectionMultiple, findFieldNextSectionSingle } from './behavior';
import { setIn, getValidationSection, analysisDynamicFields } from '../utils';
import {
   FORCUS_FIRST_FROM,
   SHOW_WARNING_FROM,
   HIDE_WARNING_FROM,
   CHANGE_STATE_FROM,
   IGNORE_WARNING_FROM,
   RESET,
   ADD_RECORD_SECTION,
   REMOVE_RECORD_SECTION,
   LOAD_DATA_FROM,
   CLEAR_DATA,
   SET_SECTION_FORM
} from "../actions";
import { checkValidationSections } from './checkValidationSections';
import { nextRecord } from './handleChangeRecord';

// import { HIDE_WARNING_FROM, SHOW_WARNING_FROM } from "../actions";

// export const handleShowWarning = (isAll = false) => ({
//    type: SHOW_WARNING_FROM,
//    payload: isAll,
//    meta: {
//      resource: 'form'
//    }
//  })
//  export const handleHideWarning = () => ({
//    type: HIDE_WARNING_FROM,
//    meta: {
//      resource: 'form'
//    }
//  })

export const setSectionsForm = (sections) => (dispatch, getState) => {
   let field = getFieldRecord(sections);
   let validationSections = getValidationSection(sections)
   let props = { sectionName: sections[0].name, rowId: 0, sections, fields: field, sectionId: 0, fieldId: -1, goto: 'down' };
   let { fieldNext } = sections[0].is_multiple ? findFieldNextSectionMultiple(props) : findFieldNextSectionSingle(props);
   let isDynamic = analysisDynamicFields([field], [{}])
   dispatch({
      type: SET_SECTION_FORM,
      payload: {
         layout: {
            layoutName: sections[0].layout_name,
            layoutId: sections[0].layout_id
         },
         sections,
         isDynamic,
         validationSections,
         value: {},
         values: [{}],
         fields: [field],
         active: fieldNext
      },
      meta: {
         resource: 'form'
      }
   })
}
export const cleanDataForm = () => (dispatch, getState) => {
   const { sections, isDynamic } = getDataObject('core.resources.form.data', getState())
   let field = getFieldRecord(sections);
   let validationSections = getValidationSection(sections)
   let props = { sectionName: sections[0].name, rowId: 0, sections, fields: field, sectionId: 0, fieldId: -1, goto: 'down' };
   let { fieldNext } = sections[0].is_multiple ? findFieldNextSectionMultiple(props) : findFieldNextSectionSingle(props);
   if (isDynamic) {
      analysisDynamicFields([field], [{}])
   }
   dispatch({
      type: CLEAR_DATA,
      payload: {
         layout: {
            layoutName: sections[0].layout_name,
            layoutId: sections[0].layout_id
         },
         validationSections,
         sections,
         value: {},
         values: [{}],
         fields: [field],
         active: fieldNext,
         isDynamic
      },
      meta: {
         resource: 'form'
      }
   })
}

export const handleShowWarning = (isAll = false) => ({
   type: SHOW_WARNING_FROM,
   payload: isAll,
   meta: {
      resource: 'form'
   }
})

export const handleHideWarning = () => ({
   type: HIDE_WARNING_FROM,
   meta: {
      resource: 'form'
   }
})

export const forcusFirstWaring = (isMulti) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let warning = clone(state.warning);
   let fields = clone(state.fields);
   let sections = state.sections;
   let fieldCurrent = fields[state.current];
   let fielWarning = getErrorRecord({ datas: warning, current: state.current, sections });
   if (fielWarning) {
      setIn(fieldCurrent, { ...fielWarning, key: 'active' }, true);
      dispatch({
         type: FORCUS_FIRST_FROM,
         payload: {
            fields,
            warning,
            awaitFocus: null,
            showWarning: false,
            active: fielWarning,
         },
         meta: {
            resource: 'form'
         }
      })
   } else {
      dispatch(handleHideWarning())
   }
}


export const handleForcusFirstWaring = (isMulti) => (dispatch, getState) => {
   dispatch(handleHideWarning());
   setTimeout(() => {
      dispatch(forcusFirstWaring(isMulti))
   }, 150)
}

export const ignoreWarningSection = () => (dispatch, getState) => {
   const { current, warningSections } = getDataObject('core.resources.form.data', getState())
   let _warningSections = clone(warningSections);
   _warningSections[current].ignore = true;
   dispatch({
      type: CHANGE_STATE_FROM,
      payload: {
         warningSections: _warningSections,
         showWarningSection: false,
      },
      meta: {
         resource: 'form'
      }
   })
}

export const ignoreWarning = (recordNext, isCurrent) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let warningCurrent = clone(state.warning);
   Object.keys(warningCurrent).forEach(key => {
      let section = warningCurrent[key]
      section.forEach(data => {
         Object.keys(data).forEach(fieldName => {
            data[fieldName].ignore = true;
         })
      })
   })
   dispatch({
      type: IGNORE_WARNING_FROM,
      payload: {
         warning: warningCurrent,
         showWarning: false,
      },
      meta: {
         resource: 'form'
      }
   })
   if (recordNext) {
      if (dispatch(checkValidationSections())) {
         setTimeout(() => {
            dispatch(nextRecord(recordNext, warningCurrent, isCurrent))
         }, 150)
      }
   }
}


export const reset = () => ({
   type: RESET,
   meta: {
      resource: 'form'
   }
})

export const handleAddRecordSection = ({ sectionName, rowId }) => ({
   type: ADD_RECORD_SECTION,
   payload: {
      sectionName, rowId
   },
   meta: {
      resource: 'form'
   }
})

export const handleRemoveRecordSection = ({ sectionName, rowId }) => ({
   type: REMOVE_RECORD_SECTION,
   payload: {
      sectionName, rowId
   },
   meta: {
      resource: 'form'
   }
})

export const handleSwitchRecordSection = ({ sectionName, rowId, direction }) => ({
   type: REMOVE_RECORD_SECTION,
   payload: {
      sectionName, rowId, direction
   },
   meta: {
      resource: 'form'
   }
})

export const loadDataForm = (payload) => ({
   type: LOAD_DATA_FROM,
   payload: payload,
   meta: {
      resource: 'form'
   }
})