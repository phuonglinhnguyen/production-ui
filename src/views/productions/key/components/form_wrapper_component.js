import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import keycode from 'keycode';
import { isEqual } from 'lodash';
import EventListener from 'react-event-listener';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import * as _style from '../style';
import clone from 'clone';
import { Translate } from 'react-redux-i18n'
import { List, ListItem } from 'material-ui/List';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import FormInputSingle from '../../../../components/common/form/form_single';
import FormToolbar from './form_toolbar';
import IconButton from 'material-ui/IconButton';
import IconComment from 'material-ui/svg-icons/communication/comment'
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import {Card,  CardHeader, CardTitle, CardText} from 'material-ui/Card';
const FormSingle = AutoResize(FormInputSingle);
export default class FormWrapper extends Component {
  state = {
    focusError: undefined,
    openDialog: false,
    comment: '',
    option: {},
    viewComment: false,
    open_conform: false,
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }
  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.task.item && (!this.props.task.item || !isEqual(this.props.task.item.task, nextProps.task.item.task))) {
        if (nextProps.task.item.task.hold_count > 0 || (nextProps.task.item.task.rework && nextProps.task.item.task.rework.rework)) {
          this.setState({ viewComment: true })
        }
      }
    } catch (error) {

    }
  }
  componentDidMount() {
    try {
      if (
        this.props.task.item
        &&
        (
          this.props.task.item.task.hold_count > 0
          || (
            this.props.task.item.task.rework
            && this.props.task.item.task.rework.rework
          )
        )
      ) {
        this.setState({ viewComment: true })
      }
    } catch (error) {
    }
  }
  handleChangeField = (recordId, name, val, { data, field, tabIndex }) => {
    const { taskActions } = this.props;
    taskActions.changeField(name, val);
  }
  // task.item.complete_option
  handleKeyDown = (event) => {
    const { task, taskActions, info, checkConformWarningRecord, checkValidationForm, viewActions } = this.props;
    let key_code = '';
    try {
      key_code = keycode(event).toLowerCase();
    } catch (error) {

    }
    if (key_code === 'f5') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.altKey && key_code === 'd') {
      event.preventDefault();
      event.stopPropagation();
      viewActions.openDialogWorkingDetail(info.projectId);
    }
    if (task.item) {
      if (task.access)
        if (event.altKey && key_code === 's') {
          event.preventDefault();
          this.handleSubmit();
        } else if (event.altKey && key_code === 's') {
          event.preventDefault();
          this.handleSubmit(null, null, true);
        } else if (event.altKey && key_code === 'w') {
          checkValidationForm();//elint-disable-line no-unused-vars
          checkConformWarningRecord(0, this.handleChangeConformWarning)
        }
    } else {
      if (key_code === 'enter') {
        event.preventDefault();
        taskActions.claimNextTask(info, task);
      }
    }
  }
  __validationSectionOfRecord = (callback) => {
    const {
      task,
      layout,
      notifyActions,
      checkValidationSectionRecord,
    } = this.props;
    let record_selecting = 0;
    let section_name = layout.item.section.name;
    let sectionError = checkValidationSectionRecord(record_selecting, section_name)
    if (sectionError.has(record_selecting) &&
      sectionError.get(record_selecting).has(section_name)
    ) {
      notifyActions.warning('Co loi xay ra!',
        sectionError.get(record_selecting).get(section_name).get('error').join(', '),
        { i18: !1, dialog: true }
      );
    } else {
      callback()
    }
  }
  setFocusSubmit = () => {
    const self = this;
    let _container = self._toolbar.refs.btn_actions.refs.btn_submit.refs.container;
    let _button = _container.button;
    _button.focus();
    _container.setKeyboardFocus();
  }
  __validationFieldsOfRecord = (callback) => {
    const {
      task,
      layout,
      notifyActions,
      checkValidationRecord,
      checkConformWarningRecord,
    } = this.props;
    let record_selecting = 0;
    checkValidationRecord(record_selecting, (state) => {
      let hasError = !!state.errorMap[record_selecting]
      let hasWarning = !!state.warningMap[record_selecting]
      if (hasError) {
        let recordIndex = Object.keys(state.errorMap).sort()[0];
        if (recordIndex) {
          let _fieldInval = Object.keys(state.errorMap[recordIndex])[0];
          this.setState({
            focusError: {
              record: recordIndex,
              fieldName: _fieldInval,
              time: Date.now()
            }
          })
          notifyActions.warning('',
            'form_vaildation.message.form_invalidate',
            { i18: !0 }
          );
        }
      } else if (hasWarning) {
        checkConformWarningRecord(record_selecting,
          (stateCheck) => {
            let recordIndex = Object.keys(stateCheck.warningMap).sort()[0];
            if (typeof recordIndex !== 'undefined') {
              let _fieldInval = Object.keys(state.warningMap[recordIndex])[0];
              this.setState({
                focusError:
                {
                  record: recordIndex,
                  fieldName: _fieldInval,
                  time: Date.now()
                }
              }
              )
            } else {
              callback()
            }
          })
      } else {
        callback()
      }
    })
  }
  handleChangeConformWarning = (data) => {
    let recordIndex = Object.keys(data).sort()[0];
    if (recordIndex) {
      let _fieldInval = Object.keys(data[recordIndex])[0];
      this.setState({ focusError: { record: recordIndex, fieldName: _fieldInval, time: Date.now() } })
    }
  }
  handleSubmit = (option, event, trustSubmit) => {
    const { taskActions, task, view, layout, info, getValueTranforms } = this.props;
    const self = this;
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        if (option && option.comment) {
          self.handleAddComment(option)
        } else {
          if (false) {
            this.openDialogConformSubmit();
          } else {
            taskActions.saveDocument(info, task, view.isNext, layout, option, getValueTranforms)
          }
        }
      })
    })

  }
  handleFocusSubmit = (event) => {
    const self = this;
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        self.setFocusSubmit();
      })
    })
  }
  closeDialog = () => {
    this.setState({ openDialog: false, comment: '', option: {} });
  }
  handleChangeComment = (event) => {
    this.setState({
      comment: event.target.value
    })
  }
  handleAddComment = (option) => {
    this.setState({ openDialog: true, comment: '', option: option });
  }
  handleSubmitComment = () => {
    const {
      taskActions,
      task,
      view,
      layout,
      info,
      getValueTranforms
    } = this.props;
    let option = clone(this.state.option)
    option.comment_text = this.state.comment;
    taskActions.saveDocument(info, task, view.isNext, layout, option, getValueTranforms)
    this.setState({ openDialog: false, comment: '', option: {} });
  }
  handleChangeViewComment = () => {
    this.setState({
      viewComment: true
    })
  }
  handleChangeViewCommentClose = () => {
    this.setState({
      viewComment: false
    })
  }
  getInfoHold = () => {
    if (this.props.task.item && this.props.task.item.task) {
      const { is_hold, hold_count } = this.props.task.item.task;
      if (is_hold) {
        return (<Toolbar style={_style.form_info}>
          <ToolbarGroup>
            <ToolbarTitle text={`Hold: ${hold_count}`} />
            <IconButton
              tooltip="Comment"
              onClick={this.handleChangeViewComment}
            ><IconComment /> </IconButton >
          </ToolbarGroup>
        </Toolbar>)
      } else
        if (this.props.task.item.task && this.props.task.item.task.rework && this.props.task.item.task.rework.rework) {
          return <Toolbar style={_style.form_info}>
            <ToolbarGroup>
              <ToolbarTitle text={'Rework'} />
              <IconButton
                tooltip="Comment"
                onClick={this.handleChangeViewComment}
              ><IconComment />
              </IconButton >
            </ToolbarGroup>
          </Toolbar>
        } else {
          return '';
        }
    } else {
      return '';
    }
  }
  getMessageComent = () => {
    try {

      if (this.props.task.item) {
        let comment = this.props.task.item.task.comment_text
        let cms = comment ? comment.split('#EOL#') : [];
        if (this.props.task.item.task && this.props.task.item.task.rework && this.props.task.item.task.rework.rework) {
          let { rework_comment, rework_fields } = this.props.task.item.task.rework
          return (<List style={{ maxHeight: 500, overflow: 'auto' }}>
            {cms.map((cm, index_cm) => {
              let spliteIndex = cm.indexOf(':')
              return (<ListItem key={index_cm}
                primaryText={cm.substring(0, spliteIndex)}
                secondaryText={cm.substring(spliteIndex + 1, cm.length)} />
              )
            })}
            <ListItem
              primaryText={rework_comment}
              secondaryText={`${rework_fields.length} fields`} />
          </List>)
        } else {
          return (<List style={{ maxHeight: 500, overflow: 'auto' }}>
            {cms.map((cm, index_cm) => {
              let spliteIndex = cm.indexOf(':')
              return (<ListItem key={index_cm}
                primaryText={cm.substring(0, spliteIndex)}
                secondaryText={cm.substring(spliteIndex + 1, cm.length)} />
              )
            })}
          </List>)
        }
      }
      return '';
    } catch (error) {
      return '';
    }
  }
  openDialogConformSubmit = () => {
    const self = this;
    setTimeout(() => {
      self.setState({ open_conform: true })
    }, 10)
  }
  hanbleCloseDialogConformSubmit = () => {
    this.setState({ open_conform: false })
  }
  hanbleDialogConformAcceptedSubmit = () => {
    const {
      info,
      task,
      view,
      layout,
      taskActions,
      getValueTranforms,
    } = this.props;
    taskActions.saveDocument(info, task, view.isNext, layout, null, getValueTranforms)
    this.setState({ open_conform: false })
  }
  render() {
    const {
      valitionForm,// eslint-disable-line no-unused-vars
      errorMap,
      warningMap,
      ignoreWarning,
      checkPattern,// eslint-disable-line no-unused-vars
      checkValidation,// eslint-disable-line no-unused-vars
      checkValidationAndPattern,
      view,
      task,
      layout,
      viewActions,
      muiTheme,
      loadingForm,
      claimTask,
      doc_info,
      claimNextTask,
      taskActions,
    } = this.props;
    const _fields = layout.item ? layout.item.fields : [];
    let _isSaving = task.isPatching;//TODO
    const _rework = task.item && task.item.task && task.item.task.rework ? task.item.task.rework : {};
    let _record = task.record || {};
    let disableInput = _isSaving || !task.access;
    return (
      <form style={_style.full}>
        <EventListener target="window" onKeyDown={this.handleKeyDown} />
        <Dialog
          key={'dialog-retry-component'}
          title="TRY SAVE"
          actions={[
            <FlatButton
              label="TRY SAVE"
              primary={true}
              disabled={task.isPatching}
              keyboardFocused={true}
              onClick={() => { taskActions.retryCompleteTask() }}
            />,
          ]}
          modal={true}
          open={task.patchFailed}
        >
          <p><Translate value={'productions.keying.message.warning.try_save'} /></p>
        </Dialog>
        <Dialog
          key={'dialog-component'}
          title="REASON FOR HOLD"
          actions={[
            <FlatButton
              label="CANCEL"
              onClick={this.closeDialog}
            />,
            <FlatButton
              label="SAVE"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleSubmitComment}
            />,
          ]}
          modal={false}
          open={this.state.openDialog}
          onRequestClose={this.closeDialog}
        >
          <TextField
            hintText="Comment reason"
            value={this.state.comment}
            fullWidth={true}
            onChange={this.handleChangeComment}
            multiLine={true}
            rows={2}
          /><br />
        </Dialog>
        <Dialog
          key={'dialog-comment'}
          title={this.props.task.item && this.props.task.item.task && this.props.task.item.task.rework && this.props.task.item.task.rework.rework ? 'Rework Notes' : 'Comment'}
          actions={[
            <FlatButton
              label="Close"
              onClick={this.handleChangeViewCommentClose}
            />,
          ]}
          modal={false}
          open={this.state.viewComment}
          onRequestClose={this.handleChangeViewCommentClose}
        >
          {this.state.viewComment ? this.getMessageComent() : ''}
        </Dialog>
        <Dialog
          key={'dialog-conform'}
          title="SAVE DATA"
          actions={[
            <FlatButton
              label="CANCEL"
              keyboardFocused={true}
              onClick={this.hanbleCloseDialogConformSubmit}
            />,
            <FlatButton
              label="SAVE"
              primary={true}
              onClick={this.hanbleDialogConformAcceptedSubmit}
            />,
          ]}
          modal={false}
          open={this.state.open_conform}
          onRequestClose={this.hanbleCloseDialogConformSubmit}
        >
          <Translate value={'productions.keyings.message.conform_save'} dangerousHTML />
          <br />
        </Dialog>
        <Paper style={{ height: 70, margin: '16px 0px 0px 0px ' }}>
          <div style={{
            padding: '1px 0px 0px 16px',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.87)',
              display: 'block',
            }}>
              <div>
                <p>
                  <span style={{ color: darkBlack }}>Batch Name: </span>{doc_info.batch_name}
                </p>
                <p>
                  <span style={{ color: darkBlack }}>Doc Name: </span>{doc_info.doc_name}
                </p>
              </div>
            </span>
          </div>

        </Paper>
        <FormToolbar
          ref={node => this._toolbar = node}
          access={task.access}
          fields={_fields}
          view={view}
          task={task}
          claimTask={claimTask}
          claimNextTask={claimNextTask}
          isSaving={_isSaving}
          onSubmit={this.handleSubmit}
          setNextTask={viewActions.setNextTask}
        />
        {this.getInfoHold()}
        <Paper zDepth={1} style={{
          ..._style.form,
          height: this.props.task.item && this.props.task.item.task && (this.props.task.item.task.is_hold || (this.props.task.item.task.rework && this.props.task.item.task.rework.rework)) ?
            `calc(100% - 180px)` : 'calc(100% - 174px)'
        }}>
          {loadingForm ? <LinearProgress mode="indeterminate" /> : ""}
          <div style={{ ..._style.bodyForm, background: muiTheme.formInput.background }}>
            <FormSingle
              refForm={node => this.form_input = node}
              view={view}
              focusError={this.state.focusError}
              loadingForm={loadingForm}
              fields={_fields}
              rework_config={_rework}
              disabled={disableInput}
              checkValidation={checkValidationAndPattern}
              editColumn={false}
              stateView={0}
              copyValue={this.handleCopyValue}
              errorMap={errorMap && errorMap[0]}
              ignoreWarning={ignoreWarning && ignoreWarning[0]}
              warningMap={warningMap && warningMap[0]}
              record={_record}
              focusSubmit={this.handleFocusSubmit}
              copyValue={taskActions.copyValueFieldPreRecord}
              changeField={this.handleChangeField.bind(this)}
              onFocusField={pos => {
                viewActions.focusPosition(pos)
              }}
            />
          </div>
        </Paper>
      </form>
    );
  }
}