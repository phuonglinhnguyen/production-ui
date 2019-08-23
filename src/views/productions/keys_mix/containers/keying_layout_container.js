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
import { setDocInfo } from '../../../LayoutHeaderInfo/actionCreator'
import KeyingWrapper from '../components/keying_wrapper_component';
import DialogContainer from '../../../../components/common/dialog/containers/dialog_container';
import { setDialog, resetDialog } from '../../../../components/common/dialog/actions/dialog_common_action';
import { Notification, NotifyActions } from '../../../shares/notification';
import { openDialogWorkingDetail, DialogWorkingDetail } from '../../../../components/common/monitor_working_detail'
import { getDataObject } from '@dgtx/coreui';
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
  componentDidMount() {
    try {
      window.addEventListener('beforeunload', this.handleClosePage)
      window.location.hash = "no-back-button";
      window.location.hash = "Again-No-back-button";//again because google chrome don't insert first hash into history
      window.onhashchange = function () { window.location.hash = "no-back-button"; }
    } catch (e) { }
  }
  componentWillUnmount() {
    const {
      match,
      taskActions,
    } = this.props;
    if (match.params.taskInstanceId) {
      taskActions.resetTask();
    }
    try {
      window.removeEventListener('beforeunload', this.handleClosePage)
      window.location.hash = "";
      window.location.hash = "";//again because google chrome don't insert first hash into history
      window.onhashchange = function () { window.location.hash = ""; }
    } catch (e) {

    }
  }
  handleClosePage = (event) => {
    let dialogText = 'Dư liệu của bạn đã lưu chưa?. Bạn có chắc muốn rồi khỏi trang này?';
    event.returnValue = dialogText;
    return dialogText;
  }
  needUpdateDocViewInfo =(doc_info, doc )=>{
    let {batch_name,doc_name,doc_uri} = doc_info
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
    const { task, match, taskActions, layoutActions, userName, layout, viewActions , doc_info } = nextProps;
    let info = { ...match.params, history: router.history, userName };
    if (task.item && task.item.doc) {
      let itemOld = this.props.task.item;
      if (!itemOld || !isEqual(itemOld.doc, task.item.doc) || !isEqual(match, this.props.match) ||this.needUpdateDocViewInfo(doc_info,task.item.doc)) {
        setTimeout(() => {
          viewActions.setDocInfo({ batch_name: task.item.doc.batch_id, doc_name: task.item.doc.id, doc_uri: task.item.doc.id })
        }, 1000);
      }
      try {
        if (layout.item && layout.item.section && layout.item.section.settings.multiple) {
          if (!match.params.isTraining && layout.item.section.settings.multiple.mask === 'require_mask') {
            let numderNeed = task.item.task.mask.record_input.length - task.records.length
            if (numderNeed > 0) {
              taskActions.initRecords(numderNeed)
            }
          } else {
            let record_no = layout.item.section.settings.multiple.record_no;
            record_no=record_no==0?1:record_no;
            let numderNeed = record_no - task.records.length
            if (numderNeed > 0) {
              taskActions.initRecords(numderNeed)
            }
          }
        }
      } catch (error) {

      }
      layoutActions.fetchIfNeeded(info);
      taskActions.referData(task, layout)
      match.params.taskInstanceId && match.params.taskInstanceId !== this.props.match.params.taskInstanceId && taskActions.fetchIfNeeded(info, task);
    }
  }
  render() {
    const { muiTheme, router } = this.context;
    const { match, userName } = this.props;
    let isTraining = false;
    if (match.url.includes('training')) {
      isTraining = true;
    }
    let info = { ...match.params, history: router.history, userName, isTraining };
    return (<div>
      <Notification />
      <DialogWorkingDetail muiTheme={muiTheme} projectId={info.projectId} />
      <DialogContainer Translate={Translate} />
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
    project:getDataObject('project.project_item.project',state)

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
