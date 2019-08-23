import { combineReducers } from 'redux';
import classify from '../views/productions/classify/reducers';
import omr from '../views/productions/omr/reducers/omr_reducer';
import verify_key from '../views/productions/verify_key/reducers';
import keying_invoice from '../views/productions/invoice/reducers';
import verify_hold from '../views/productions/verify_hold/reducers/verify_hold_reducer';
import group_images from '../views/productions/group_images/reducers/group_images_reducer';
import data_viewer from '../views/productions/data_viewer/reducers';
import reworkBatch from '../views/productions/rework_batch/reducers/rework_batch_reducer'
import project_guide_view from '../views/project_guide_view/reducers/project_guide_view_reducer'
import sections from '../views/productions/rework_batch/reducers/sections_reducer'

const production = combineReducers({
  classify,
  omr,
  verify_key,
  keying_invoice,
  verify_hold,
  group_images,
  data_viewer,
  reworkBatch,
  project_guide_view,
  sections,
});

export { production };
