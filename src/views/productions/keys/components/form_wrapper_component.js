import React, { Component } from 'react';
import clone from 'clone'
import keycode from 'keycode';
import { isEqual } from 'lodash';
import Paper from 'material-ui/Paper';
import EventListener from 'react-event-listener';
import LinearProgress from 'material-ui/LinearProgress';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { List, ListItem } from 'material-ui/List';
import { Translate } from 'react-redux-i18n'
import IconButton from 'material-ui/IconButton';
import IconComment from 'material-ui/svg-icons/communication/comment'
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import * as _style from '../style';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import FormInputMultiple from '../../../../components/common/form/form_multiple';
import FormToolbar from './form_toolbar';
import Recordscomponent from './records_component'
import Shortcut from './shortcut'
import ActionHistory from 'material-ui/svg-icons/action/history'
import { Card, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
const FormMultiple = AutoResize(FormInputMultiple);
export default class FormWrapper extends Component {
  state = {
    focusError: undefined,
    openDialog: false,
    comment: '',
    option: {},
    viewComment: false,
    openDialogConformTrust: false,
    hot_keys_reason: {},
    open_conform: false,
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }
  handleChangeField = (recordId, name, val, { data, field, tabIndex }) => {
    const { taskActions } = this.props;
    taskActions.changeField(name, val);
  }
  componentDidMount = () => {
    try {
      if (this.props.task.item &&
        (this.props.task.item.task.hold_count > 0 || (this.props.task.item.task.rework && this.props.task.item.task.rework.rework))) {
        this.setState({ viewComment: true })
      }
    } catch (error) {
    }
  }
  componentWillReceiveProps(nextProps) {
    const { task } = nextProps;
    const self = this;
    let hot_keys_reason = {};
    try {
      task.item.complete_option.forEach(reason => {
        let key = reason.value.substring(0, 1).toLowerCase()
        hot_keys_reason[key] = reason;
      })
    } catch (error) { }
    if (!isEqual(this.state.hot_keys_reason, hot_keys_reason)) {
      this.setState({ hot_keys_reason })
    }
    try {
      if (nextProps.task.item && (!this.props.task.item || !isEqual(this.props.task.item.task, nextProps.task.item.task))) {
        if (nextProps.task.item.task.hold_count > 0 || (nextProps.task.item.task.rework && nextProps.task.item.task.rework.rework)) {
          this.setState({ viewComment: true })
        }
      }
    } catch (error) {
    }
  }
  handleCopyValue = (fieldName, callback) => {
    const { task } = this.props;
    try {
      let value = task.records[task.record_selecting - 1][fieldName] || ''
      callback && callback(value)
    } catch (error) {
      callback && callback()
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      task,
      layout,
      taskActions,
      notifyActions,
      checkValidationRecord,
      checkValidationSectionRecord,
      checkConformWarningRecord,
    } = this.props;
    const self = this;
    if (task.record_select_waiting > -1) {
      self.__validationFieldsOfRecord(() => {
        self.__validationSectionOfRecord(() => {
          self.setState({ focusError: { record: task.record_select_waiting, fieldName: layout.item.fields[0].name, time: Date.now() } })
          taskActions.setDataRecord(task.record_selecting)
          taskActions.selectRecord(task.record_select_waiting);
        })
      })
    }
  }
  handleKeyDown = (event) => {
    const {
      info,
      view,
      task,
      layout,
      taskActions,
      viewActions,
      checkConformWarning,
      checkValidationForm,
    } = this.props;
    const { hot_keys_reason } = this.state;
    let key_code = ''
    try {
      key_code = keycode(event).toLowerCase();
    } catch (error) {
      key_code = '';
    }
    if (event.altKey && key_code === 'left') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (key_code === 'enter') {
      let disableInput = false;
      try {
        if (layout.item.section.settings.multiple.mask === "require_mask") {
          disableInput = !task.item.task.mask.record_input[task.record_selecting]
        }
      } catch (error) {

      }
      if (disableInput) {
        event.preventDefault();
        event.stopPropagation();
        this.handleNextRecord()
      }
    }
    if (key_code === 'f5') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.altKey) {
      let disable_update_record = false;
      try {
        disable_update_record = (layout.item.section.settings.multiple.mask === "require_mask" || layout.item.section.settings.multiple.record_no === '-1')
      } catch (error) { }
      if (!disable_update_record) {
        if (key_code === "numpad +" || key_code === 'a' || key_code === '=') {
          this.insertRecordValidate();
          event.preventDefault();
          event.stopPropagation();
        }
        if (key_code === "numpad -" || key_code === '-') {
          event.preventDefault();
          event.stopPropagation();
          this.removeRecordValidate();
        }
      }
    }
    if (event.altKey && hot_keys_reason[key_code]) {
      if (task.item.task.hold_count <= 5) {
        this.handleSubmit(hot_keys_reason[key_code])
      }
    }
    if (event.altKey && key_code === 'numpad 8') {
      event.preventDefault();
      this.handleSwitchRecord(task.record_selecting, true)
    }
    if (event.altKey && key_code === 'numpad 2') {
      event.preventDefault();
      this.handleSwitchRecord(task.record_selecting, false)
    }
    if (event.altKey && key_code === 'd') {
      event.preventDefault();
      event.stopPropagation();
      viewActions.openDialogWorkingDetail(info.projectId);
    }
    if (event.altKey && key_code === 'm') {
      event.preventDefault();
      viewActions.setViewRecords(!view.view_records)
    } else
      if (event.altKey && (key_code === 'n')) {
        this.handleNextRecord(true)
      } else if (event.altKey && (key_code === 'u')) {
        this.handleUpdateRecord();
      }
      else if (event.altKey && key_code === 'p') {
        this.handleBackRecord();
      }
    if (task.item) {
      if (task.access)
        if (event.altKey && key_code === 's') { /**@description change hotkey save data 's' to 'l'  by request dung_mama "cancel"*/
          event.preventDefault();
          this.handleSubmit();
        } else if (event.ctrlKey && key_code === 's') {
          event.preventDefault();
          if (event.shiftKey) {
            this.handleSubmit(null, null, true);
          }
        } else if (event.altKey && key_code === 'w') {
          let error = checkValidationForm();
          checkConformWarning(this.handleChangeConformWarning)
        }
    }
  }

  insertRecordValidate = () => {
    const self = this;
    const {
      taskActions,
      task,
      layout,
      insertRecordValidate } = this.props;
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        taskActions.insertRecord(task.record_selecting)
        let nextIndex = parseInt(task.record_selecting + 1)
        self.setState({
          focusError:
          {
            record: nextIndex,
            fieldName: layout.item.fields[0].name,
            time: Date.now()
          }
        })
        taskActions.setDataRecord(task.record_selecting)
        taskActions.selectRecord(nextIndex);
      })
    })
  }
  removeRecordValidate = () => {
    const {
      task,
      layout,
      taskActions,
      removeRecordValidate,
    } = this.props;
    try {
      if (task.records.length > layout.item.section.settings.multiple.record_no) {
        taskActions.removeRecord(task.record_selecting)
        removeRecordValidate(task.record_selecting)
      }
    } catch (e) {

    }
  }
  handleUpdateRecord = () => {
    const {
      task,
      layout,
      taskActions,
      switchRecord,
      notifyActions,
      checkValidationRecord,
      checkConformWarningRecord,
    } = this.props;
    const self = this;
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        this.setState({
          focusError: {
            record: task.record_select_waiting,
            fieldName: layout.item.fields[0].name,
            time: Date.now()
          }
        })
        taskActions.setDataRecord(task.record_selecting)
      })
    })
  }
  handleSwitchRecord = (index, isUp) => {
    const {
      task,
      layout,
      taskActions,
      switchRecord,
    } = this.props;
    const self = this;
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        self.setState({
          focusError:
          {
            record: task.record_select_waiting,
            fieldName: layout.item.fields[0].name,
            time: Date.now()
          }
        });
        taskActions.setDataRecord(task.record_selecting)
        switchRecord(task.record_selecting, isUp)
        taskActions.switchRecord(task.record_selecting, isUp)
      })
    })
  }
  setFocusSubmit = () => {
    const self = this;
    let _container = self._toolbar.refs.btn_actions.refs.btn_submit.refs.container;
    let _button = _container.button;
    _button.focus();
    _container.setKeyboardFocus();
  }
  handleNextRecord = (top) => {
    const self = this;
    const {
      task,
      layout,
      taskActions,
    } = this.props;
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        let nextIndex = parseInt(task.record_selecting + 1)
        if (nextIndex < task.records.length) {
          this.setState({
            focusError:
            {
              record: nextIndex,
              fieldName: top ? '__current_field__' : layout.item.fields[0].name,
              time: Date.now()
            }
          })
          taskActions.setDataRecord(task.record_selecting)
          taskActions.selectRecord(nextIndex);
        } else {
          self.setFocusSubmit();
        }
      })
    })
  }
  __validationSectionOfRecord = (callback) => {
    const {
      task,
      layout,
      notifyActions,
      checkValidationSectionRecord,
    } = this.props;
    let section_name = layout.item.section.name;
    let sectionError = checkValidationSectionRecord(task.record_selecting, section_name)
    if (sectionError.has(task.record_selecting) &&
      sectionError.get(task.record_selecting).has(section_name)
    ) {
      notifyActions.warning('Co loi xay ra!',
        sectionError.get(task.record_selecting).get(section_name).get('error').join(', '),
        { i18: !1, dialog: true }
      );
    } else {
      callback()
    }
  }
  __validationFieldsOfRecord = (callback) => {
    const {
      task,
      layout,
      notifyActions,
      checkValidationRecord,
      checkConformWarningRecord,
    } = this.props;
    checkValidationRecord(task.record_selecting, (state) => {
      let hasError = !!state.errorMap[task.record_selecting]
      let hasWarning = !!state.warningMap[task.record_selecting]
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
        checkConformWarningRecord(task.record_selecting,
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
  checkValidationChangeRecord = (isNext, top) => {
    const self = this;
    const {
      task,
      layout,
      taskActions,
      notifyActions,
      checkValidationRecord,
      checkConformWarningRecord,
      checkValidationSectionRecord,
    } = this.props;
    /**@description check validation all field of record 
     * by rules of each fields */
    self.__validationFieldsOfRecord(() => {
      self.__validationSectionOfRecord(() => {
        let nextIndex = parseInt(isNext ?
          task.record_selecting + 1
          : task.record_selecting - 1)
        if (nextIndex >= 0 && nextIndex < task.records.length) {
          self.setState({
            focusError:
            {
              record: nextIndex,
              fieldName: top ? '__current_field__' : layout.item.fields[0].name,
              time: Date.now()
            }
          })
          taskActions.setDataRecord(task.record_selecting)
          taskActions.selectRecord(nextIndex);
        } else {
          self.setFocusSubmit()
        }
      })
    })
  }
  handleBackRecord = (top) => {
    this.checkValidationChangeRecord(false, top);
  }
  handleChangeConformWarning = (data) => {
    const { taskActions } = this.props;
    let recordIndex = Object.keys(data).sort()[0];
    if (recordIndex) {
      let _fieldInval = Object.keys(data[recordIndex])[0];
      taskActions.selectRecord(parseInt(recordIndex));
      this.setState({
        focusError:
        {
          record: recordIndex,
          fieldName: _fieldInval,
          time: Date.now()
        }
      })
    }
  }
  handleSubmit = (option, event, trustSubmit) => {
    const {
      info,
      task,
      view,
      layout,
      viewActions,
      taskActions,
      notifyActions,
      getValueTranforms,
      checkValidationForm,
      checkConformWarning,
      stateView,
    } = this.props;
    let error = checkValidationForm();
    if (error.errorMap) {
      let recordIndex = Object.keys(error.errorMap).sort()[0];
      let _fieldInval = Object.keys(error.errorMap[recordIndex])[0];
      taskActions.selectRecord(parseInt(recordIndex));
      this.setState({
        focusError:
        {
          record: recordIndex,
          fieldName: _fieldInval,
          time: Date.now()
        }
      })
      notifyActions.warning('',
        'form_vaildation.message.form_invalidate',
        { i18: !0 });
      return;
    } else if (error.warningMap && Object.keys(error.warningMap).length) {
      checkConformWarning(this.handleChangeConformWarning)
      return
    }
    taskActions.setDataRecord(task.record_selecting)
    if (option && option.comment) {
      this.handleAddComment(option)
      return
    }
    if (trustSubmit) {
      this.openDialogConformTrust();
      // taskActions.saveDocument(info, task, view.isNext, layout, option, getValueTranforms)
    } else {
      if (task.recordsChecked.length !== task.records.length) {
        notifyActions.warning('',
          'form_vaildation.message.form_invalidate',
          { i18: !0 });
        return;
      }
      this.__validationSectionOfRecord(() => {
        if (stateView.overflow) {
          this.openDialogConformSubmit();
        } else {
          taskActions.saveDocument(info, task, view.isNext, layout, option, getValueTranforms)
        }
      })
    }
  }
  openDialogConformTrust = () => {
    this.setState({ openDialogConformTrust: true })
  }
  closeDialogConformTrust = () => {
    this.setState({ openDialogConformTrust: false })
  }
  submitDialogConformTrust = () => {
    const {
      task,
      info,
      view,
      layout,
      taskActions,
      getValueTranforms,
    } = this.props;
    taskActions.saveDocument(info, task, view.isNext, layout, null, getValueTranforms)
    this.setState({ openDialogConformTrust: false })
  }
  handleFocusSubmit = (event, down) => {
    const {
      task,
      taskActions,
      notifyActions,
      checkValidationRecord,
      checkConformWarningRecord,
      checkValidationSectionRecord,
    } = this.props;
    const self = this;
    if (down) {
      if (task.records[task.record_selecting + 1]) {
        this.handleNextRecord()
      } else {
        self.__validationFieldsOfRecord(() => {
          self.__validationSectionOfRecord(() => {
            self.setFocusSubmit();
          })
        })
      }
    } else {
      if (task.records[task.record_selecting - 1]) {
        taskActions.selectRecord(task.record_selecting - 1)
      }
    }
    event.preventDefault();
  }
  closeDialog = () => {
    const self = this;
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
      const { comment_text, is_hold, hold_count } = this.props.task.item.task;
      if (is_hold) {
        return <ToolbarGroup>
          <ToolbarTitle text={'Hold: ' + hold_count} />
          <IconButton
            tooltip="Comment"
            onClick={this.handleChangeViewComment}
          ><IconComment /> </IconButton >
        </ToolbarGroup>
      } else
        if (this.props.task.item.task && this.props.task.item.task.rework && this.props.task.item.task.rework.rework) {
          return <ToolbarGroup>
            <ToolbarTitle text={'Rework'} style={{ color: 'red' }} />
            <IconButton
              tooltip="Comment"
              onClick={this.handleChangeViewComment}
            ><IconComment />
            </IconButton >
          </ToolbarGroup>
        } else {
          return '';
        }
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
    } catch (e) {
      return '';
    }
  }
  handleSubmitComment = () => {
    const {
      info,
      task,
      view,
      layout,
      taskActions,
      notifyActions,
      getValueTranforms,
    } = this.props;
    let option = clone(this.state.option)
    option.comment_text = this.state.comment;
    taskActions.saveDocument(info, task, view.isNext, layout, option, getValueTranforms)
    this.setState({ openDialog: false, comment: '', option: {} });
  }
  handleOpenWorkingDetail = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const { viewActions, info } = this.props;
    viewActions.openDialogWorkingDetail(info.projectId);
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
  hanbleCloseDialogConformSubmitClick = () => {
    const { layout, task } = this.props;
    this.props.viewer && this.props.viewer.resetInside();
    this.setState({
      open_conform: false,
      focusError: {
        record: task.record_selecting,
        fieldName: layout.item.fields[0].name,
        time: Date.now()
      }
    })
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
      view,
      task,
      layout,
      muiTheme,
      errorMap,
      warningMap,
      claimTask,
      claimNextTask,
      viewActions,
      taskActions,
      loadingForm,
      ignoreWarning,
      checkPattern,// eslint-disable-line no-unused-vars
      valitionForm,// eslint-disable-line no-unused-vars
      checkValidation,// eslint-disable-line no-unused-vars
      checkValidationAndPattern,
      showControlFocus,
      onChangeShowMask,
      showMask,
      project,
      doc_info,
    } = this.props;
    const _fields = layout.item ? layout.item.fields : [];
    let _isSaving = task.isPatching;
    const _rework = task.item && task.item.task && task.item.task.rework ? task.item.task.rework : {};
    let _record = task.records[task.record_selecting] || {};
    let disableInput = _isSaving || !task.access;
    try {
      if (layout.item.section.settings.multiple.mask === "require_mask") {
        disableInput = !task.item.task.mask.record_input[task.record_selecting]
      }
    } catch (error) {

    }
    let undone = task.records.length - task.recordsChecked.length
    undone = Math.max(undone, 0)
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
          <p><Translate value={'productions.keyings.message.warning.try_save'} /></p>
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
          />
          <br />
        </Dialog>
        <Dialog
          key={'dialog-conform-trust'}
          title="SAVE DATA WARNING"
          actions={[
            <FlatButton
              label="CANCEL"
              onClick={this.closeDialogConformTrust}
            />,
            <FlatButton
              label="SAVE"
              primary={true}
              keyboardFocused={true}
              onClick={this.submitDialogConformTrust}
            />,
          ]}
          modal={false}
          open={this.state.openDialogConformTrust}
          onRequestClose={this.closeDialogConformTrust}
        >
          <p>
            <Translate
              value={'productions.keyings.message.warning.trust_save'}
              undone={undone}
              total_record={task.records.length} />
          </p>
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
          {this.state.viewComment ?
            this.getMessageComent()
            : ''
          }
          <br />
        </Dialog>
        <Dialog
          key={'dialog-conform'}
          title="SAVE DATA"
          actions={[
            <FlatButton
              label="CLOSE"
              keyboardFocused={true}
              onClick={this.hanbleCloseDialogConformSubmitClick}
            />
          ]}
          modal={false}
          open={this.state.open_conform}
          onRequestClose={this.hanbleCloseDialogConformSubmitClick}
        >
          <Translate value={'productions.keyings.message.conform_save_warning_overflow'} dangerousHTML />
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
        <Toolbar style={_style.form_info}>
          {showControlFocus && (
            <ToolbarGroup>
              <Checkbox
                label="Focus"
                checked={showMask}
                onCheck={() => { onChangeShowMask && onChangeShowMask() }}
              />
            </ToolbarGroup>
          )}
          <ToolbarGroup>
            <ToolbarTitle text="Record:" />
            <ToolbarTitle text={task.record_selecting + 1} />
          </ToolbarGroup>
          {this.getInfoHold()}
          <ToolbarGroup>
            <ToolbarTitle
              text={`${task.recordsChecked.length}/${task.records.length}`} />
            <IconButton
              tooltip='Working detail'
              onClick={this.handleOpenWorkingDetail}>
              <ActionHistory />
            </IconButton>
            <Shortcut />
          </ToolbarGroup>
        </Toolbar>
        <Paper zDepth={1} style={{
          ..._style.form,
          height: `calc(100% - ${loadingForm ? 180 : 174}px)`
        }}>
          {loadingForm ? <LinearProgress mode="indeterminate" /> : ""}
          <div style={{
            ..._style.bodyForm,
            background: muiTheme.formInput.background
          }}>
            <FormMultiple
              refForm={node => this.form_input = node}
              view={view}
              focusError={this.state.focusError}
              loadingForm={loadingForm}
              fields={_fields}
              rework_config={_rework}
              disabled={disableInput}
              checkValidation={(name, val) => checkValidationAndPattern(name, val, task.record_selecting)}
              editColumn={false}
              stateView={0}
              onNextRecord={this.handleNextRecord}
              onBackRecord={this.handleBackRecord}
              errorMap={errorMap[task.record_selecting]}
              ignoreWarning={ignoreWarning[task.record_selecting]}
              warningMap={warningMap[task.record_selecting]}
              record={_record}
              copyValue={this.handleCopyValue}
              record_selecting={task.record_selecting}
              focusSubmit={this.handleFocusSubmit}
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

