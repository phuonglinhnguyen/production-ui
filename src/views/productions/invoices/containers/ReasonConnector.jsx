
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReasonDialog from './ReasonDialog';
import { showCommentSave, hideCommentSave, changeCommentSave } from '../actions/formActions';
import { saveTask } from '../actions/taskActions'
import { getDataObject } from '@dgtx/coreui';
export default connect((state, ownProps) => {
    const option = getDataObject('core.resources.form_state.data.optionSave', state);
    const patching = getDataObject('core.resources.form_state.data.patching', state);
    const dataPatch = Boolean(getDataObject('core.resources.form_state.data.dataPatch', state));
    return {
        option,
        patching,
        dataPatch
    }
},
    (dispatch: any) => bindActionCreators({
        saveTask,
        showCommentSave,
        hideCommentSave,
        changeCommentSave
    }, dispatch)
)(ReasonDialog)
