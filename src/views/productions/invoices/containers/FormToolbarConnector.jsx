import * as React from 'react'
import { connect } from 'react-redux'
import { getDataObject } from '@dgtx/coreui';
import { bindActionCreators } from 'redux';
import QuickAccess from '../../../../@components/QuickAccess';
import { saveTask, saveTaskWithReason, pauseTask } from '../actions/taskActions'
import { updateNextTask } from '../actions/formActions'
export default connect((state, ownProps) => {
   const { focusSubmit } = getDataObject('core.resources.form.data', state)||{}
   const {
      setting: { isNext } = {},
      task: {
         complete_option,
         input_data = {},
         hold_count,
         comment,
         rework_comment,
         rework,
         rework_fields }={}
   } = getDataObject('core.resources.form_state.data', state)||{}
   return {
      input_data,
      focusSubmit,
      infoWord: {
         comment,
         hold_count,
         rework_comment,
         rework,
         rework_fields,
      },
      reasons: complete_option || [],
      is_disabled: ownProps.disabled,
      is_saving: ownProps.saving,
      next: isNext,
   }
},
   (dispatch: any) => bindActionCreators({
      saveTask: saveTask,
      pauseTask: pauseTask,
      saveTaskWithReason: saveTaskWithReason,
      updateNextTask: updateNextTask
   }, dispatch)
)(QuickAccess)


{/*  */ }