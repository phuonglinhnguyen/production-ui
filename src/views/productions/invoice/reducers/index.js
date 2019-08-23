import { combineReducers } from 'redux';

import invoice_document from './invoice_document_reducer';
import invoice_error from './invoice_error_reducer';
import invoice_image from './invoice_image_reducer';
import section_definitions from './invoice_layout_reducer';
import task_definitions from './invoice_task_reducer';
import invoice_detail from './invoice_detail_dialog_reducer';

export default combineReducers({
  invoice_document,
  invoice_error,
  invoice_image,
  invoice_detail,
  section_definitions,
  task_definitions
});
