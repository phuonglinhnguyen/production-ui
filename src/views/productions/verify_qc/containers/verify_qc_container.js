import React from 'react';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { I18n, Translate } from 'react-redux-i18n';

import VerifyQcForm from '../components/verify_qc_component';
import QcFormProcessing from '../../../shares/Snackbars/Snackbars';
// import * as constants from '../../../../constants'


const VerifyQcContainer = props =>
    <div>
        <QcFormProcessing muiTheme={props.muiTheme} Translate={Translate} />
     
        <VerifyQcForm I18n={I18n} Translate={Translate} {...props} muiTheme={props.muiTheme} />
      

    </div>;

const mapStateToProps = state => {
    const { qc } = state.production;

    return {
        qc: qc.qc_multiple,
        qc_error: qc.qc_error,
        current_user: state.user,
       
    };
};

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(
    muiThemeable()(VerifyQcContainer)
);
