
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReasonDialog from './TrySaveDialog';
import { cancelTryPatch } from '../actions/formActions';
import { tryCompleleTask } from '../actions/taskActions'
import { getDataObject } from '@dgtx/coreui';
export default connect((state, ownProps) => {
    const patching = getDataObject('core.resources.form_state.data.patching', state);
    const dataPatch = getDataObject('core.resources.form_state.data.dataPatch', state);
    return {
        patching,
        dataPatch
    }
},
    (dispatch: any) => bindActionCreators({
        tryCompleleTask,
        cancelTryPatch
    }, dispatch)
)(ReasonDialog)
