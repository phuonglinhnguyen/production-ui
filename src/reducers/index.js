import {
  i18nReducer
} from 'react-redux-i18n';
import layout from './layoutReducer'
import common from './common'
import { production } from './production'
import project from '../resources/reducers/project'
import notification from '../views/shares/notification/reducer'
import snackbar from '../views/shares/Snackbars/reducer'
import field_list from '../resources/reducers/fields'

import keying from '../views/productions/key/reducers'
import keyings from '../views/productions/keys/reducers'
import layout_header_information from '../views/LayoutHeaderInfo/reducer'
import connect from './connect'
const rootReducer = {
  i18n: i18nReducer,
  layout_header_information,
  notification,
  layout,
  common,
  project,
  production,
  field_list,
  keying,
  keyings,
  snackbar,
  connect,
};

export default rootReducer;