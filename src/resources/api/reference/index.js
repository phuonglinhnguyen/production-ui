import _omr from './omr_test';
import upload_connections from './upload_connections';
import _recent_data from './recent_data'
import _recent_data_local_storage from './recent_data_local_storage'
import _ocr from './ocr';
export const Omr = _omr;
export const ocr = _ocr;
export const recent_data = _recent_data;
export const recent_data_local_storage = _recent_data_local_storage;
export default {
    ocr,
    Omr,
    upload_connections,
    recent_data,
    recent_data_local_storage
}