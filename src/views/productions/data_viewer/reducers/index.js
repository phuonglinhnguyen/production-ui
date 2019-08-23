import { combineReducers } from 'redux';

import layouts from './layout_reducer';
import batches from './batch_reducer';
import documents from './document_reducer';

export default combineReducers({
  layouts,
  batches,
  documents
});
