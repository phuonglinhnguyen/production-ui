import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ThumbnailComponent from '../components/image_thumbnail_component';

import { selectImage } from '../actions/index';

// import { Translate } from 'react-redux-i18n';

const ThumbnailContainer = props => {
  const { show_thumbnail, actions, image_index, s2_images } = props;

  if (!show_thumbnail) {
    return null;
  }
  return (
    <div id="div_thumbnails" style={{ ...props.style }}>
      <ThumbnailComponent
        action_selectImage={actions.selectImage}
        image_uris={s2_images}
        slider={image_index}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const {
    show_thumbnail,
    image_index,
    s2_images
  } = state.production.keying_invoice.invoice_image;
  return {
    image_index,
    show_thumbnail,
    s2_images
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      selectImage
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(ThumbnailContainer);
