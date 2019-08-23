import React, { Component } from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';
import Viewer from '../../../../components/common/viewer/components_multiple/viewer';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import VerifyQcImageEmpty from './verify_qc_empty_component';

const ViewerAutoResize = AutoResize(Viewer);

class VerifyQcImageComponent extends Component {

    render() {
        const { qc_image, is_fetching_tasks } = this.props;
        if (qc_image.imageUrl && qc_image.rectangle) {

            return (
                <ViewerAutoResize
                    imageUrl={qc_image.imageUrl}
                    rectangle={qc_image.rectangle}
                    line={qc_image.line}
                    section={qc_image.section}
                />
            );
        } else {
            return (
                <VerifyQcImageEmpty
                    task={null}
                    getTask={this.props.getTask}
                    is_fetching_tasks={is_fetching_tasks}
                />
            );
        }

    }
}
export default muiThemeable()(VerifyQcImageComponent);