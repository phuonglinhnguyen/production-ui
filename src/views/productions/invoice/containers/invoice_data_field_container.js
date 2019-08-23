import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../../../../components/Loading/Loading';
import DataFieldComponent from '../components/data_field/invoice_data_component';

import * as actions from '../actions/index';

import { Translate } from 'react-redux-i18n';

const DataFieldContainer = props => {
  const {
    actions,
    comment,
    history,
    invoice_document,
    invoice_error,
    match,
    muiTheme,
    section_definitions,
    task_definitions,
    username
  } = props;
  if (section_definitions.should_get_layout) {
    return (
      <Loading
        beforeMount={() => {
          actions.getLayoutDefinition(match.params, username, history);
        }}
      />
    );
  }
  const record_focused = invoice_document.record_focused;
  const data_record = invoice_document.document_data[record_focused];
  return (
    <DataFieldComponent
      Translate={Translate}
      action_addOrRemoveSectionItem={is_add =>
        actions.addOrRemoveSectionItem(is_add, match.params.action)
      }
      action_changeFieldMode={actions.changeFieldMode}
      action_clearText={actions.clearText}
      action_onFocusField={actions.onFocusField}
      action_onKeyPressFocus={actions.onKeyPressFocus}
      action_onModifyFieldValue={actions.onModifyFieldValue}
      action_openDetailDialog={actions.openDetailDialog}
      action_resetState={actions.resetState}
      action_saveTask={actions.saveTask}
      action_updateNextTask={actions.updateNextTask}
      action_getTempData={actions.getTempData}
      anchor={invoice_document.anchor}
      comment={comment}
      complete_reason={invoice_document.complete_reason}
      data_record={data_record}
      error_record={invoice_error.error_record}
      field_focused={invoice_document.field_focused}
      history={props.history}
      index_item_focused={invoice_document.index_item_focused}
      is_claimming_task={task_definitions.is_claimming_task}
      is_empty_state={task_definitions.is_empty_state}
      is_next_task={task_definitions.is_next_task}
      is_saving={task_definitions.is_saving}
      muiTheme={muiTheme}
      params={match.params}
      section_definitions={section_definitions.datas}
      section_focused={invoice_document.section_focused}
      textarea_mode={invoice_document.textarea_mode}
      username={username}
    />
  );
};

const mapStateToProps = state => {
  const { user } = state;
  const {
    invoice_document,
    invoice_error,
    section_definitions,
    task_definitions
  } = state.production.keying_invoice;
  const { comment } = state.production.keying_invoice.invoice_document.doc_info;

  return {
    comment,
    invoice_document: invoice_document,
    invoice_error: invoice_error,
    section_definitions: section_definitions,
    task_definitions: task_definitions,
    username: user.user.username
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...actions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(DataFieldContainer);
