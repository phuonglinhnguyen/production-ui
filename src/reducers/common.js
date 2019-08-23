import { combineReducers } from 'redux';

import notification_bar from '../components/common/notification/bar/reducer'
import field_validation from '../components/common/field_validation/reducers/field_validation_reducer'
import call_ajax from "../components/common/ajax/call_ajax/reducers/call_ajax_reducer";
import common_dialog from "../components/common/dialog/reducers/dialog_reducer";
import working_detail from '../components/common/monitor_working_detail/reducers'


export default combineReducers({
    common_dialog,
    notification_bar,
    field_validation,
    ajax_call_ajax: call_ajax,
    working_detail
})