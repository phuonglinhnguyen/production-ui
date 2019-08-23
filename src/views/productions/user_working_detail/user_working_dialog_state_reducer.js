import { SHOW_WORKING_DETAIL, HIDE_WORKING_DETAIL } from "./actions";

export default {
   name: 'user_working_dialog_state',
   reducer: (state = { show: false }, { type, payload, meta }) => {
      switch (type) {
         case SHOW_WORKING_DETAIL:
            return { ...state, show: true, projectId: payload }
         case HIDE_WORKING_DETAIL:
            return { ...state, show: false }
         default:
            return state;
      }
   }
}; 