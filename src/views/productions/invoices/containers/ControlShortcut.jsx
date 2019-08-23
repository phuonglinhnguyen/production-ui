// @flow strict
import * as React from 'react';
import { connect } from 'react-redux';
import { getDataObject } from '@dgtx/coreui';
import { ControlShortcut } from '../../../../@components';
import { saveTaskWithReasonShortcut, saveTask } from '../actions/taskActions';
import {
   handleUpdateData,
   handleAddRecord,
   handleNextRecord,
   handlePreviousRecord,
   handleShowWarning,
   handleRemoveRecord
} from '../../../../@components/FormInput';
import { getNoRecord } from '../actions/formActions'

const initListenChangeNoRecord = (listeners, sections, values) => {
   let noRecord = getNoRecord(sections)
   if (noRecord === 0) {
      listeners = listeners.concat([
         { key: ["altKey", '='], handle: handleAddRecord },
         { key: ["altKey", 'a'], handle: handleAddRecord },
         { key: ["altKey", '-'], handle: handleRemoveRecord },])
   } else if (noRecord > 0) {
      if (values.length > noRecord) {
         listeners = listeners.concat([
            { key: ["altKey", '='], handle: handleAddRecord },
            { key: ["altKey", 'a'], handle: handleAddRecord },
            { key: ["altKey", '-'], handle: handleRemoveRecord },])
      } else {
         listeners = listeners.concat([
            { key: ["altKey", '='], handle: handleAddRecord },
            { key: ["altKey", 'a'], handle: handleAddRecord },
            // { key: ["altKey", '-'], handle: handleRemoveRecord },
         ])
      }
   }
   return listeners;
}
const state = (state, ownProps) => {
   const { disabled = false } = ownProps;
   // ["altKey","ctrlKey","shiftKey",'key']
   let listeners = [
      { key: ["altKey", 's'], handle: saveTask },
      { key: ["altKey", 'arrowup'], handle: 'saveTask' },
      { key: ["altKey", 'arrowdown'], handle: 'handleSwitchRecord' },
      { key: ["altKey", 'd'], handle: 'openDialogWorkingDetail' },
      { key: ["altKey", 'm'], handle: 'setViewRecords' },
      { key: ["altKey", 'n'], handle: handleNextRecord },
      { key: ["altKey", 'u'], handle: handleUpdateData },
      { key: ["altKey", 'p'], handle: handlePreviousRecord },
      { key: ["altKey", 'w'], handle: handleShowWarning() },
      { key: ["altKey", 'shiftKey', 'w'], handle: handleShowWarning(true) },
   ];
   const complete_option = getDataObject('core.resources.form_state.data.task.complete_option', state) || [];
   const { sections = [], values = [] } = getDataObject('core.resources.form.data', state) || {};

   listeners = initListenChangeNoRecord(listeners, sections, values);

   complete_option.forEach(option => {
      let key = option.value.substring(0, 1).toLowerCase()
      listeners.push(
         {
            key: ['altKey', key],
            handle: saveTaskWithReasonShortcut(option)
         }
      )
   })
   return {
      disabled,
      listeners
   }
}
export default connect(state)(ControlShortcut);