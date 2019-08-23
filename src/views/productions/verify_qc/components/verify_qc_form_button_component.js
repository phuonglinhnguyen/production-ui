import React from 'react';
import PropTypes from 'prop-types';
import VerifyQcForm from './verify_qc_form_component'
import * as constants from '../constants'
import VerifyQcActions from './verify_qc_button_component'


class VerifyQcFormAction extends React.Component {
    constructor(props) {
        super(props);


        this.saveTask = this.saveTask.bind(this);
        this.handleCheckNextTask = this.handleCheckNextTask.bind(this);
        this.viewQcError = this.viewQcError.bind(this);
        this.handleCancelWarning = this.handleCancelWarning.bind(this);
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    handleCheckNextTask() {
        this.props.actions.updateNextTask();
    }
    handleCancelWarning(warningMap,callBackError,callbackSuccess) {

        const warningMapKeys = warningMap ? Object.keys(warningMap) : [];
        if (warningMapKeys.length > 0) {
            const { qc_pre_data } = this.props;
            const { fields = [] } = qc_pre_data;
            var row = warningMapKeys[0], fieldErrorIndex, fieldError;
            for (var index in fields) {
                var field = fields[index];
                if (warningMap[row].hasOwnProperty(field.name)) {
                    fieldErrorIndex = index;
                    fieldError = field;
                    break;
                }
            }
            if (fieldError) {
                let fieldTabIndex = (row * fields.length) + fieldErrorIndex;
                fieldError.tabIndex = +fieldTabIndex + 1;;
            }
            callBackError("", fieldError);
        } else {
            callbackSuccess();
        }

    }
    callActionSaveTask() {

        const { current_user, qc_button } = this.props;
        const { projectId, taskId, layoutName } = this.context.router.route.match.params;

        const _props = { ...this.props }
        const next_task = qc_button.next_task;

        _props.actions.saveTask(projectId, taskId, constants.VERIFY_QC_MAX_SIZE, layoutName, current_user.user.username, next_task);

    }
    saveTask() {
        const _props = { ...this.props };
        const _this=this;
        setTimeout(function () {
            const { errorMap, warningMap, qc_pre_data } =_props;
            const { fields = [] } = qc_pre_data;
            const errorMapKeys = errorMap ? Object.keys(errorMap) : [];
            if (errorMapKeys.length > 0) {
                var row = errorMapKeys[0], fieldErrorIndex, fieldError;
                for (var index in fields) {
                    var field = fields[index];
                    if (errorMap[row].hasOwnProperty(field.name)) {
                        fieldErrorIndex = index;
                        fieldError = field;
                        break;
                    }
                }
                if (fieldError) {
                    let fieldTabIndex = (row * fields.length) + fieldErrorIndex;
                    fieldError.tabIndex = +fieldTabIndex + 1;;
                }
                _props.actions.handleSaveError("Please Correct All Fields!!!", fieldError);
            } else if (warningMap && Object.keys(warningMap).length > 0) {
                _props.checkConformWarning(_this.handleCancelWarning,_props.actions.handleSaveError,_this.callActionSaveTask);
            } else {
                _this.callActionSaveTask();
            }
        }, 0)
    }
    viewQcError() {
        this.props.actions.viewQcError();
    }
    render() {
        const {
            current_user,
            moduleName,
            actions,
            qc_error,
            qc_form,
            qc_pre_data,
            qc_button,
            height,
            width,
            errorMap,
            ignoreWarning,
            warningMap,
            checkValidationAndPattern } = this.props;
        const { qc_tasks } = qc_form;
        const disable_button = !qc_tasks || qc_tasks.length === 0;
        const { fields = [] } = qc_pre_data;
        const { display_records } = qc_form;
        const qc_error_open = qc_error.open;
        const tabIndexSubmit = fields.length * display_records.length + 1;

        return (
            <div>
                <VerifyQcActions
                    next={qc_button.next_task}
                    updateNextTask={this.handleCheckNextTask}
                    saveTask={this.saveTask}
                    viewQcError={this.viewQcError}
                    is_disabled={disable_button}
                    tabIndexSubmit={tabIndexSubmit}
                />
                <VerifyQcForm
                    qc_form={qc_form}
                    qc_error_open={qc_error_open}
                    qc_pre_data={qc_pre_data}
                    current_user={current_user}
                    moduleName={moduleName}
                    actions={actions}
                    height={height - 30}
                    width={width}
                    recordsInput={[...display_records]}
                    ignoreWarning={ignoreWarning}
                    warningMap={warningMap}
                    checkValidationAndPattern={checkValidationAndPattern}
                    errorMap={errorMap}
                />
            </div>
        )
    }
}
export default VerifyQcFormAction;