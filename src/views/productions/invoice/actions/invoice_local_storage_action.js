import { updateDocumentData } from './invoice_document_private_action';

// Structure Elrond_username_invoice_data : {task_id : '' , data : []}
const saveTempData = () => (dispatch, getState) => {
  const {
    doc_info,
    document_data
  } = getState().production.keying_invoice.invoice_document;
  localStorage.setItem(
    `Elrond_${doc_info.username || 'default'}_invoice_data`,
    JSON.stringify({ task_id: doc_info.task_id, data: document_data })
  );
};

const getTempData = (username, task_id) => dispatch => {
  let value = localStorage.getItem(
    `Elrond_${username || 'default'}_invoice_data`
  );
  value = JSON.parse(value);
  if(!value ||  (task_id && task_id !== value.task_id)){
    return;
  }
  return dispatch(updateDocumentData(value.data));
};

export { getTempData, saveTempData };
