import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Translate } from 'react-redux-i18n';
import { isEqual } from 'lodash'
import { NAME_STORE } from '../constants';
import { FUNCTION_KEYING_SINGLE } from '../../../../constants'

import viewActions from '../actions/view_action_creator';
import taskActions from '../actions/task_actions_creator';
import layoutActions from '../actions/layout_actions';
import {setDocInfo} from '../../../LayoutHeaderInfo/actionCreator'

import KeyingWrapper from '../components/keying_wrapper_component';
import DialogContainer from '../../../../components/common/dialog/containers/dialog_container';
import { setDialog, resetDialog } from '../../../../components/common/dialog/actions/dialog_common_action';
import { Notification, NotifyActions } from '../../../shares/notification';
import { openDialogWorkingDetail, DialogWorkingDetail } from '../../../../components/common/monitor_working_detail'

class KeyingContainer extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  };
  componentWillMount() {
    const { router } = this.context;
    const { match, layoutActions, userName, taskActions, task } = this.props;
    let info = { ...match.params, history: router.history, userName };
    layoutActions.fetchIfNeeded(info);
    match.params.taskInstanceId && taskActions.fetchIfNeeded(info, task);
  }
  componentWillUnmount() {
    const {
      match,
      taskActions,
     } = this.props;
    if (match.params.taskInstanceId) {
      taskActions.resetTask();
    }
  }
  needUpdateDocViewInfo =(doc_info, doc )=>{
    let {batch_name,doc_name} = doc_info
    let {id,batch_id} = doc;
    if((batch_name !== batch_id)||
    (doc_name !==id )
  ){
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
    const { task, match, taskActions, layoutActions, userName, layout ,doc_info} = nextProps;
    let info = { ...match.params, history: router.history, userName };
    if(task.item&&task.item.doc){
      let itemOld = this.props.task.item;
      if(!itemOld||!isEqual(itemOld.doc,task.item.doc)||match.url!==this.props.match.url||this.needUpdateDocViewInfo(doc_info,task.item.doc)){
        this.props.viewActions.setDocInfo({batch_name: task.item.doc.batch_id, doc_name: task.item.doc.id, doc_uri: task.item.doc.id})
      }
    } 
    layoutActions.fetchIfNeeded(info);
    taskActions.referData(task, layout)
    match.params.taskInstanceId && match.params.taskInstanceId !== this.props.match.params.taskInstanceId && taskActions.fetchIfNeeded(info, task);
  }
  render() {
    const { muiTheme, router } = this.context;
    const { match, userName } = this.props;
    let isTraining = false;
    if(match.url.includes('training')){
      isTraining= true;
    }
    let info = { ...match.params, history: router.history, userName, isTraining};
    return (<div>
      <Notification />
      <DialogContainer Translate={Translate} />
      <DialogWorkingDetail muiTheme={muiTheme} projectId={info.projectId}/>
      <KeyingWrapper {...this.props} muiTheme={muiTheme} router={router} info={info} />
    </div>)
  }
}

const mapStateToProps = state => {
  const dialog = state.common.common_dialog;
  let { doc_info } = state.layout_header_information;
  const { view, layout, task } = state[NAME_STORE];
  return {
    task,
    view: { ...view, dialog },
    layout,
    doc_info,
    loadingForm: task.isFetching || layout.isFetching,
    userName: state.user.user.username,
    moduleName: FUNCTION_KEYING_SINGLE,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    viewActions: bindActionCreators({ ...viewActions, setDialog, resetDialog, setDocInfo, openDialogWorkingDetail }, dispatch),
    taskActions: bindActionCreators({ ...taskActions }, dispatch),
    layoutActions: bindActionCreators({ ...layoutActions }, dispatch),
    notifyActions: bindActionCreators({ ...NotifyActions }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyingContainer);
