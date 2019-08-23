import clone from 'clone'
import { getDataObject } from "@dgtx/coreui";
import { ON_NEXT_FIELD } from '../actions';
import { findFieldNextSectionMultiple, findFieldNextSectionSingle } from './behavior';
import { handleChangeRecord } from './handleChangeRecord';

export const handleNextField = ({ sectionName, rowId, fieldName, source, value }) => (dispatch, getState) => {
   const state = getDataObject('core.resources.form.data', getState())
   let sections = state.sections;
   let sectionId = sections.findIndex(item => item.name === sectionName)
   let fieldId = sections[sectionId].fields.findIndex(item => item.name === fieldName);
   let props = { sectionName, rowId, fieldName, sections, fields: state.fields[state.current], sectionId, fieldId, goto: source.goto };
   let nextPosition = sections[sectionId].is_multiple ? findFieldNextSectionMultiple(props) : findFieldNextSectionSingle(props);
   if (nextPosition) {
     let { fieldNext, current } = nextPosition;
     if (fieldNext) {
       dispatch({
         type: ON_NEXT_FIELD,
         payload: {
           active: fieldNext
         },
         meta: {
           resource: 'form'
         }
       })
     } else {
       dispatch(handleChangeRecord(state.current + current, false))
     }
   }
 }