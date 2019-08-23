import { combineReducers } from 'redux';

import field_definitions from './field_definitions_reducer';
import verify_key from './verify_key_reducer';

export default combineReducers({
  field_definitions,
  verify_key
});
