import { combineReducers } from 'redux';
import qc_form from './qc_multiple_form_reducer';
import qc_button from './qc_multiple_button_reducer'
import qc_field from './qc_multiple_field_reducer'
import qc_pre_data from './qc_multiple_pre_data_reducer'
import qc_image from './qc_multiple_image_reducer'
const qc_multiple = combineReducers({
  qc_form,
  qc_button,
  qc_field,
  qc_pre_data,
  qc_image
});

export default verify_qc;
