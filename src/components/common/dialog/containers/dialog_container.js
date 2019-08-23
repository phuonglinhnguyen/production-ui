import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Dialog from '../components/dialog_component';

import { resetDialog } from '../actions/dialog_common_action';

const DialogContainer = ({ dialog, actions, Translate }) => (
  <Dialog dialog={dialog} actions={actions} Translate={Translate} />
);

DialogContainer.propTypes = {
  dialog: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,

  Translate: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const dialog = state.common.common_dialog;
  return { dialog };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ resetDialog }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogContainer);
