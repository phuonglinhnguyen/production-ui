import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import VerifyKeyData from '../components/verify_key_data_component';
import VerifyKeyImage from '../components/verify_key_image_component';
import VerifyKeyLoading from '../components/verify_key_loading_component';
import Snackbar from '../../../shares/Snackbars/Snackbars';

import {
  getRelateDefinition,
  getTask,
  resetState,
  saveTask,
  updateNextTask
} from '../actions/verify_key_action';

import {
  onBlurField,
  onFocusField,
  onKeyDownSelectValue,
  onModifyFieldValue,
  onKeyPressFocus,
  onSelectRecord
} from '../actions/verify_key_data_action';

import { Translate } from 'react-redux-i18n';

import _ from 'lodash';

const VerifyKeyContainer = props => {
  const { verify_key, field_definitions } = props;

  const style_main = {
    height: 'calc(100vh - 72px)',
    display: 'flex',
    flexWrap: 'Wrap',
    backgroundColor: props.muiTheme.palette.background1Color
  };

  if (verify_key.is_fetch_field_definitions) {
    return (
      <VerifyKeyLoading
        action_getRelateDefinition={props.actions.getRelateDefinition}
        match={props.match}
      />
    );
  }
  return (
    <div style={style_main}>
      <VerifyKeyImage
        is_empty_state={verify_key.is_empty_state}
        is_fetching_task_verify_key={verify_key.is_fetching_task}
        history={props.history}
        match={props.match}
        positions={verify_key.positions}
        is_render={verify_key.is_render}
        url_image={verify_key.doc_info ? verify_key.doc_info.s2_url : ''}
        username={props.username}
        action_getTask={props.actions.getTask}
      />
      <VerifyKeyData
        action_onBlurField={props.actions.onBlurField}
        action_onFocusField={props.actions.onFocusField}
        action_onKeyDownSelectValue={props.actions.onKeyDownSelectValue}
        action_onModifyFieldValue={props.actions.onModifyFieldValue}
        action_onSelectRecord={props.actions.onSelectRecord}
        action_resetState={props.actions.resetState}
        action_saveTask={props.actions.saveTask}
        action_updateNextTask={props.actions.updateNextTask}
        action_onKeyPressFocus={props.actions.onKeyPressFocus}
        data_document={verify_key.data_document}
        error_document={verify_key.error_document}
        data_final={verify_key.data_final}
        field_definitions={field_definitions}
        focus_details={_.pick(verify_key, ['focus_record', 'focus_field_name'])}
        history={props.history}
        is_empty_state={verify_key.is_empty_state}
        is_fetching_task_verify_key={verify_key.is_fetching_task}
        is_saving={verify_key.is_saving}
        next_task={verify_key.is_next_task}
        params={props.match.params}
        primary1Color={props.muiTheme.palette.primary1Color}
        accent1Color={props.muiTheme.palette.accent1Color}
        muiTheme={props.muiTheme}
        username={props.username}
      />
      <Snackbar muiTheme={props.muiTheme} Translate={Translate} />
    </div>
  );
};

const mapStateToProps = state => {
  const { user } = state;
  const { verify_key, field_definitions } = state.production.verify_key;

  return {
    username: user.user.username,
    verify_key,
    field_definitions
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      getRelateDefinition,
      getTask,
      onBlurField,
      onFocusField,
      onKeyPressFocus,
      onKeyDownSelectValue,
      onModifyFieldValue,
      onSelectRecord,
      resetState,
      updateNextTask,
      saveTask
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyKeyContainer);
