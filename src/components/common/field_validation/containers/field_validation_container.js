import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FieldValidationComponent from '../components/field_validation_component';
import { I18n, Translate } from 'react-redux-i18n';
import {
    validateField
} from '../actions/field_validation_action';
import { getList } from '../../../../resources/creators/fields'




const FieldValidationContainer = props =>
    <div>

        <FieldValidationComponent I18n={I18n} Translate={Translate} {...props} />
    </div>;

const mapStateToProps = (state, ownProps) => {
    return {
        field_validation: state.common.field_validation

    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            validateField,
            getList
        },
        dispatch
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(
    FieldValidationContainer
);
