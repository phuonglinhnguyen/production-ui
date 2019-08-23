import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CanvasComponent from '../components/image_canvas_component';
import ImageEmpty from '../components/image_empty_component';

import { onModifyFieldValue, getTask } from '../actions/index';

const ImageCanvasContainer = props => {
  const {
    actions,
    history,
    image_selected,
    image_index,
    match,
    ocr_item,
    section_definitions,
    show_thumbnail,
    task_definitions,
    username,
    words_position
  } = props;
  const { is_empty_state, is_claimming_task, is_saving } = task_definitions;
  if (is_empty_state || is_claimming_task || is_saving) {
    return (
      <ImageEmpty
        action_getTask={actions.getTask}
        history={history}
        is_available_get_task={section_definitions.should_get_layout}
        is_claimming_task={is_claimming_task}
        is_empty_state={is_empty_state}
        is_saving={is_saving}
        params={match.params}
        username={username}
      />
    );
  }
  return (
    <div id="div-image" style={{ ...props.style }}>
      <CanvasComponent
        action_onModifyFieldValue={actions.onModifyFieldValue}
        image_selected={image_selected}
        image_index={image_index}
        ocr_item={ocr_item}
        show_thumbnail={show_thumbnail}
        words_position={words_position}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const {
    invoice_image,
    section_definitions,
    task_definitions
  } = state.production.keying_invoice;
  const {
    image_selected,
    ocr_item,
    show_thumbnail,
    words_position,
    image_index
  } = invoice_image;
  const { user } = state;
  return {
    image_selected,
    image_index,
    ocr_item,
    section_definitions: section_definitions,
    show_thumbnail,
    task_definitions: task_definitions,
    username: user.user.username,
    words_position
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getTask,
      onModifyFieldValue
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ImageCanvasContainer
);
