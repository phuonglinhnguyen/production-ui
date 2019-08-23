import React from 'react';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';

import CommonActionComponent from '../../../common/button_actions';
import KeyingInvoiceDocument from './invoice_data_document_component';

import { isEqual } from 'lodash';

import MoreIcon from 'material-ui/svg-icons/navigation/more-vert';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import WorkingTimeIcon from 'material-ui/svg-icons/action/restore';
import ShortcutIcon from 'material-ui/svg-icons/action/info';

import {
  KEY_COMMENT_DIALOG,
  KEY_SHORTCUT_DIALOG,
  KEY_WORKING_DETAIL_DIALOG,
  KEY_SELF_COMMENT_DIALOG
} from '../../constants/invoice_constant';

const styles = {
  main: {
    overflow: 'croll'
  }
};

class KeyingInvoice extends React.Component {
  constructor(props) {
    super(props);

    this.saveTask = this.saveTask.bind(this);
    this.renderMoreAction = this.renderMoreAction.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    try {
      window.addEventListener('beforeunload', this.handleClosePage);
      window.location.hash = 'no-back-button';
      window.location.hash = 'Again-No-back-button'; //again because google chrome don't insert first hash into history
      window.onhashchange = function() {
        window.location.hash = 'no-back-button';
      };
    } catch (e) {}
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.props.action_resetState();
    try {
      window.removeEventListener('beforeunload', this.handleClosePage);
      window.location.hash = '';
      window.location.hash = ''; //again because google chrome don't insert first hash into history
      window.onhashchange = function() {
        window.location.hash = '';
      };
    } catch (e) {}
  }

  handleClosePage = event => {
    let dialogText =
      'Dư liệu của bạn đã lưu chưa?. Bạn có chắc muốn rồi khỏi trang này?';
    event.returnValue = dialogText;
    return dialogText;
  };

  handleKeyDown(event) {
    const {
      action_clearText,
      action_getTempData,
      is_empty_state,
      username
    } = this.props;
    if (is_empty_state) {
      return;
    }
    const code = event.code;
    if (code === 'F5') {
      event.preventDefault();

      return action_getTempData(username);
    }
    if (code === 'Backquote') {
      event.preventDefault();
      action_clearText(event.ctrlKey);
    }
  }

  saveTask(reason) {
    const {
      action_openDetailDialog,
      action_saveTask,
      history,
      is_next_task,
      params,
      username
    } = this.props;
    if (reason && reason.comment) {
      return action_openDetailDialog(KEY_SELF_COMMENT_DIALOG, reason);
    }
    return action_saveTask(username, is_next_task, params, history, reason);
  }

  renderMoreAction() {
    const { action_openDetailDialog, comment } = this.props;
    return (
      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreIcon />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        {comment && (
          <IconButton
            tooltip="Comment"
            onClick={() => action_openDetailDialog(KEY_COMMENT_DIALOG)}
          >
            <ChatIcon />
          </IconButton>
        )}
        <IconButton
          tooltip="Working daily"
          onClick={() => action_openDetailDialog(KEY_WORKING_DETAIL_DIALOG)}
        >
          <WorkingTimeIcon />
        </IconButton>
        <IconButton
          tooltip="Shortcut"
          onClick={() => action_openDetailDialog(KEY_SHORTCUT_DIALOG)}
        >
          <ShortcutIcon />
        </IconButton>
      </IconMenu>
    );
  }

  render() {
    const {
      Translate,
      action_addOrRemoveSectionItem = () => undefined,
      action_changeFieldMode = () => undefined,
      action_onBlurField = () => undefined,
      action_onFocusField = () => undefined,
      action_onKeyPressFocus = () => undefined,
      action_onModifyFieldValue = () => undefined,
      action_updateNextTask,
      anchor,
      complete_reason,
      data_record,
      error_record,
      field_focused,
      index_item_focused,
      is_empty_state,
      is_next_task,
      is_saving,
      muiTheme,
      section_definitions,
      section_focused,
      textarea_mode
    } = this.props;

    return (
      <div style={styles.main}>
        <CommonActionComponent
          reasons={complete_reason}
          is_disabled={is_empty_state}
          is_saving={is_saving}
          muiTheme={muiTheme}
          next={is_next_task}
          saveTask={this.saveTask}
          saveTaskWithReason={reason => this.saveTask(reason)}
          updateNextTask={action_updateNextTask}
          children={!is_empty_state ? this.renderMoreAction() : null}
        />
        <KeyingInvoiceDocument
          Translate={Translate}
          action_addOrRemoveSectionItem={action_addOrRemoveSectionItem}
          action_changeFieldMode={action_changeFieldMode}
          action_onBlurField={action_onBlurField}
          action_onFocusField={action_onFocusField}
          action_onKeyPressFocus={action_onKeyPressFocus}
          action_onModifyFieldValue={action_onModifyFieldValue}
          anchor={anchor}
          data_record={data_record}
          error_record={error_record}
          field_focused={field_focused}
          index_item_focused={index_item_focused}
          is_empty_state={is_empty_state}
          muiTheme={muiTheme}
          section_definitions={section_definitions}
          section_focused={section_focused}
          textarea_mode={textarea_mode}
        />
      </div>
    );
  }
}

export default KeyingInvoice;
