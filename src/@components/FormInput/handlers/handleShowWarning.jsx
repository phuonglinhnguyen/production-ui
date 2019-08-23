import { SHOW_WARNING_FROM } from "../actions";

export const handleShowWarning = (isAll = false) => ({
   type: SHOW_WARNING_FROM,
   payload: isAll,
   meta: {
     resource: 'form'
   }
 })