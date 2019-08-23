import React from 'react';

import ViewDataContainer from './data_viewer_container';
import ImageViewerContainer from './image_viewer_container';
import StepperContainer from './step_container';

import AjaxContainer from '../../../../components/common/ajax/call_ajax/containers/call_ajax_container';

import muiThemeable from 'material-ui/styles/muiThemeable';

const styles = {
  main: {
    height: '100%',
    width: '100%'
  }
};

const InvoiceContainer = props => (
  <div style={styles.main}>
    <StepperContainer {...props} />
    <ImageViewerContainer {...props} />
    <ViewDataContainer {...props} />
    <AjaxContainer />
  </div>
);

export default muiThemeable()(InvoiceContainer);
