import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AjaxItem from '../../.././../components/common/ajax/call_ajax/containers/call_ajax_container';
import VerifyHoldDetail from '../components/verify_hold_detail_component';
import VerifyHoldImage from '../components/verify_hold_image_component';
import VerifyHoldTask from '../components/verify_hold_task_component';

import * as verify_hold_actions from '../actions/index';

import { Translate } from 'react-redux-i18n';

const BatchInformationContainer = props => {
  const { verify_hold, actions, muiTheme, match, username } = props;
  const style_main = {
    backgroundColor: props.muiTheme.palette.background1Color,
    display: 'flex',
    width:'100%',
    height: 'calc(100vh - 72px)',
    overFlow: 'hidden'
  };
  return (
    <div style={style_main}>
      <VerifyHoldTask
        Translate={Translate}
        action_selectTask={actions.selectTask}
        is_empty_state={verify_hold.is_empty_state}
        muiTheme={muiTheme}
        task_index_selected={verify_hold.task_index_selected}
        tasks={verify_hold.tasks}
      />
      <VerifyHoldImage
        Translate={Translate}
        action_getTask={actions.getTask}
        is_empty_state={verify_hold.is_empty_state}
        is_getting_task={verify_hold.is_getting_task}
        match={match}
        muiTheme={muiTheme}
        url_image={verify_hold.task_selected.s2_url || []}
        username={username}
      />
      <VerifyHoldDetail
        Translate={Translate}
        action_modifyComment={actions.modifyComment}
        action_modifyHold={actions.modifyHold}
        action_resetState={actions.resetState}
        action_saveTask={actions.saveTask}
        action_updateNextTask={actions.updateNextTask}
        is_empty_state={verify_hold.is_empty_state}
        is_saving={verify_hold.is_saving}
        match={match}
        muiTheme={muiTheme}
        next_task={verify_hold.next_task}
        section_error={verify_hold.section_error}
        task={verify_hold.task_selected}
        username={username}
      />
      <AjaxItem Translate={Translate} />
    </div>
  );
};

const mapStateToProps = state => {
  const verify_hold = state.production.verify_hold;
  const { user } = state;
  return {
    username: user.user.username,
    verify_hold
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...verify_hold_actions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  BatchInformationContainer
);
