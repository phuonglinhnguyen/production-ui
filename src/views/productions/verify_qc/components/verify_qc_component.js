import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Wrapper from '../../../../components/common/layout/wrapper';
import LayoutSeparate from '../../../../components/common/layout/layout_separate';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import Paper from 'material-ui/Paper/Paper';
import { cloneDeep } from 'lodash'
import VerifyQcImage from './verify_qc_image_component';

import { QC_NUMBER_TASK_CLAIM } from '../../../../constants';
import VerifyQcFormAction from './verify_qc_form_button_component'
import Loading from '../../../../components/Loading/Loading';

const VerifyQcImageAutoResize = AutoResize(VerifyQcImage);



const VerifyQcRecordsAutoResize = AutoResize(VerifyQcFormAction);
class VerifyQcComponent extends Component {

    constructor(props) {
        super(props);

        this.getTask = this.getTask.bind(this);

    }


    static contextTypes = {
        router: PropTypes.object.isRequired
    };
  

    getTask() {
        const { current_user } = this.props;
        const { projectId, taskId, layoutName } = this.context.router.route.match.params;
        this.props.actions.getTask(projectId, taskId, QC_NUMBER_TASK_CLAIM, layoutName, current_user.user.username);
    }


    render() {
        const { qc, current_user, moduleName, actions, qc_error } = this.props;
        const { qc_form, qc_pre_data, qc_button, qc_image } = qc;
        const { is_fetching } = qc_pre_data;
        if (is_fetching) {
            return <Loading />
        }
        const { is_fetching_tasks } = qc_form;

        const { fields = [] } = qc_pre_data;
        return (
            <Wrapper
                muiTheme={this.props.muiTheme}
                offset={{ top: 80, left: 15 }}

            >
                <LayoutSeparate
                    firstStyle={{ height: 'calc(65% - 8px )' }}
                    viewType={2}
                    first={
                        <Paper zDepth={2} style={{ height: 'calc(100% - 16px)', width: 'calc(100% - 22px)', position: 'relative', margin: '16px 0 0 16px', }}>
                            <VerifyQcImageAutoResize
                                qc_image={qc_image}
                                is_fetching_tasks={is_fetching_tasks}
                                getTask={this.getTask}
                            />
                        </Paper>
                    }
                    second={
                        <div style={{ height: 'calc(100% - 16px)', width: 'calc(100% - 22px)', position: 'relative', margin: '0 0 0 16px' }}>
                            <VerifyQcRecordsAutoResize
                                qc_button={qc_button}
                                qc_form={qc_form}
                                qc_error={qc_error}
                                qc_pre_data={qc_pre_data}
                                current_user={current_user}
                                moduleName={moduleName}
                                actions={actions}
                                fieldsValidation={cloneDeep(fields)}
                            />
                        </div>

                    }
                />
            </Wrapper>
        );
    }
}
export default muiThemeable()(VerifyQcComponent);