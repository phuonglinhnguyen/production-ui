import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import WarningListComponent from '../components/warning_list_component';

import { closeWarningList } from '../actions/index';

import { Translate } from 'react-redux-i18n';

const WarningListContainer = props => {
  const {
    action_warning_list,
    actions,
    field_focused,
    index_item_focused,
    is_open_warning_list,
    muiTheme,
    section_focused,
    warning_field = [],
    warning_list
  } = props;

  if (!is_open_warning_list) {
    return null;
  }
  return (
    <WarningListComponent
      Translate={Translate}
      action_closeWarningList={actions.closeWarningList}
      action_warning_list={action_warning_list}
      field_focused={field_focused}
      index_item_focused={index_item_focused}
      muiTheme={muiTheme}
      section_focused={section_focused}
      warning_field={warning_field}
      warning_list={warning_list}
    />
  );
};

const mapStateToProps = state => {
  const {
    action_warning_list,
    is_open_warning_list,
    warning_field,
    warning_list
  } = state.production.keying_invoice.invoice_error;
  const {
    field_focused,
    index_item_focused,
    section_focused
  } = state.production.keying_invoice.invoice_document;
  return {
    action_warning_list,
    field_focused,
    index_item_focused,
    is_open_warning_list,
    section_focused,
    warning_field,
    warning_list
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      closeWarningList
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  WarningListContainer
);
