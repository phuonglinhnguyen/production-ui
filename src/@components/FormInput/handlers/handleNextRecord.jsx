import { getDataObject } from "@dgtx/coreui";
import { handleChangeRecord } from "./handleChangeRecord";

export const handleNextRecord = (isCurrent = true) => (dispatch, getState) => {
   let current = getDataObject('core.resources.form.data.current', getState())
   dispatch(handleChangeRecord(current + 1))
 }