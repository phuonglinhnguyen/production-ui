import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DetailComponent from '../components/invoice_dialog_component';

import { closeDetailDialog, saveTask } from '../actions/index';

import { Translate } from 'react-redux-i18n';

const WarningListContainer = props => {
  const {
    is_open,
    type_detail,
    actions,
    comment,
    task_definitions,
    username,
    reason
  } = props;
  if (!is_open) {
    return null;
  }
  return (
    <DetailComponent
      Translate={Translate}
      muiTheme={props.muiTheme}
      action_closeDetailDialog={actions.closeDetailDialog}
      action_saveTask={self_comment =>
        actions.saveTask(
          username,
          task_definitions.is_next_task,
          props.match.params,
          props.history,
          { ...reason, self_comment: self_comment }
        )
      }
      comment={comment}
      is_open={is_open}
      type_detail={type_detail}
    />
  );
};

const mapStateToProps = state => {
  const {
    is_open,
    reason,
    type_detail
  } = state.production.keying_invoice.invoice_detail;
  const task_definitions = state.production.keying_invoice.task_definitions;
  const { user } = state;
  const { comment } = state.production.keying_invoice.invoice_document.doc_info;
  return {
    comment,
    is_open,
    reason,
    type_detail,
    task_definitions,
    username: user.user.username
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      closeDetailDialog,
      saveTask
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  WarningListContainer
);
