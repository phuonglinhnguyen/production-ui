import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ImageViewerComponent from '../components/image_viewer_component';

import { openCloseImageViewer } from '../actions/index';

import { Translate } from 'react-redux-i18n';

const ImageViewerContainer = props => {
  const { actions, batches, s2_url, show_image ,doc_name } = props;
  if (batches.step !== 1 || !show_image) {
    return <div />;
  }
  return (
    <ImageViewerComponent
      action_openCloseImageViewer={actions.openCloseImageViewer}
      doc_name={doc_name}
      s2_url={s2_url}
      Translate={Translate}
    />
  );
};

const mapStateToProps = state => {
  const batches = state.production.data_viewer.batches;
  const { show_image, s2_url,doc_name } = state.production.data_viewer.documents;

  return {
    batches,
    s2_url,
    doc_name,
    show_image
  };
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      openCloseImageViewer
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ImageViewerContainer
);
