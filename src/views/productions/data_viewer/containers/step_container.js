import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StepComponent from '../components/step_component';

import * as data_viewer_action from '../actions/index';

const StepContainer = props => {
  const { batch_selected, step, match, actions, username } = props;
  const params = match.params;

  return (
    <StepComponent
      action_selectStep={step => actions.selectStep(step, params, username)}
      batch_selected={batch_selected}
      step={step}
    />
  );
};

const mapStateToProps = state => {
  const { batch_selected, step } = state.production.data_viewer.batches;
  const { document_selected } = state.production.data_viewer.documents;
  const username = state.user.user.username;

  return {
    batch_selected,
    document_selected,
    step,
    username
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...data_viewer_action
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(StepContainer);
