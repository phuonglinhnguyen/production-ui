import React from 'react';

import DataFieldContainer from './invoice_data_field_container';
// import DataImageCroppedContainer from './data_image_cropped_container.1';
// import RecordsContainer from './records_container';
import ImageCanvasContainer from './image_canvas_container';
import ImageThumbnailContainer from './image_thumbnail_container';
import WarningListContainer from './warning_list_container';
import InvoiceDetailContainer from './invoice_dialog_container';
import AjaxContainer from '../../../../components/common/ajax/call_ajax/containers/call_ajax_container';

import muiThemeable from 'material-ui/styles/muiThemeable';

const styles = {
  main: {
    width: '100%',
    height: '100%'
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  image: {
    resize: 'horizontal',
    overflow: 'scroll',
    height: '100%',
    width: 'calc(50vw)',
    display: 'flex',
    flexDirection: 'column'
  },
  image_thumbnail: {
    height: '176px'
  },
  image_canvas: {
    height: '100%',
    background: '#212121'
  },
  data: {
    flex: '1',
    height: '100%',
    width: 'calc(30vw)',
    display: 'flex',
    flexDirection: 'column'
  },
  data_cropped: {
    flex: '0 0 200px',
    height: '100%',
    background: 'green'
  },
  data_field: {
    flex: '1',
    height: '100%',
    background: '#FF9800'
  }
};

const InvoiceContainer = props => (
  <div style={styles.main}>
    <div style={styles.content}>
      <div style={styles.image}>
        <ImageThumbnailContainer style={styles.image_thumbnail} />
        <ImageCanvasContainer style={styles.image_canvas} {...props} />
      </div>
      <div style={styles.data}>
        {/* <DataImageCroppedContainer style={styles.data_cropped} /> */}
        <DataFieldContainer {...props} />
      </div>
    </div>
    <WarningListContainer {...props} />
    <InvoiceDetailContainer {...props} />
    <AjaxContainer />
  </div>
);

export default muiThemeable()(InvoiceContainer);
