import { crudGetOne, showNotification } from "@dgtx/coreui";

export const SHOW_WORKING_DETAIL = '@@USER_WORKING/SHOW_WORKING_DETAIL'
export const HIDE_WORKING_DETAIL = '@@USER_WORKING/HIDE_WORKING_DETAIL'

export const loadDataWorkingDetail = (projectId, taskKeyDef) => (dispatch, getState) => {
   dispatch(crudGetOne('user_working_detail', { projectId }, {
      onSuccess: () => { },
      onFailure: () => { }
   }))
}
export const handleShowWorkingDetail = (projectId, username) => (dispatch, getState) => {
   dispatch({
      type: SHOW_WORKING_DETAIL,
      payload: projectId,
         meta: {
         resource: 'user_working_dialog_state'
      }
   })
}
export const handleHideWorkingDetail = (payload) => ({
   type: HIDE_WORKING_DETAIL,
   meta: {
      resource: 'user_working_dialog_state'
   }
})

