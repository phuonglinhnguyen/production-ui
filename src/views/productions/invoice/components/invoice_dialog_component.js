import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';

import {
  KEY_COMMENT_DIALOG,
  KEY_SELF_COMMENT_DIALOG
} from '../constants/invoice_constant';

import { isEqual } from 'lodash';

class WarningListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      self_comment: '',
      error: ''
    };
    this.getMessageContent = this.getMessageContent.bind(this);
    this.changeSelfComment = this.changeSelfComment.bind(this);
    this.actionSaveComment = this.actionSaveComment.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    for (let key_state in nextState) {
      if (!isEqual(nextState[key_state], this.state[key_state])) {
        return true;
      }
    }
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

  getMessageContent = comment => {
    let cms = comment.split('#EOL#');
    if (!comment) {
      return null;
    }
    return (
      <List>
        {cms.map((cm, i) => {
          let spliteIndex = cm.indexOf(':');
          return (
            <ListItem
              key={`item-chat-${i}`}
              primaryText={cm.substring(0, spliteIndex)}
              secondaryText={cm.substring(spliteIndex + 1, cm.length)}
            />
          );
        })}
      </List>
    );
  };

  changeSelfComment(value) {
    let error = '';
    if (!value) {
      error = 'productions.keying_invoice.field_required';
    }
    this.setState({
      self_comment: value,
      error: error
    });
  }

  actionSaveComment(self_comment, actionClose) {
    const { action_saveTask } = this.props;
    if (!self_comment) {
      this.setState({
        error: 'productions.keying_invoice.field_required'
      });
      return;
    }
    action_saveTask(self_comment);
    actionClose();
  }

  render() {
    const {
      Translate,
      action_closeDetailDialog,
      comment,
      is_open,
      // muiTheme,
      type_detail
    } = this.props;
    const { self_comment, error } = this.state;
    let actions = [
      <FlatButton
        label={'Ok'}
        primary={true}
        onClick={() => {
          if (type_detail === KEY_SELF_COMMENT_DIALOG) {
            return this.actionSaveComment(
              self_comment,
              action_closeDetailDialog
            );
          }
          action_closeDetailDialog();
        }}
      />
    ];
    if (type_detail === KEY_SELF_COMMENT_DIALOG) {
      actions.unshift(
        <FlatButton
          label={'Cancel'}
          primary={true}
          onClick={() => {
            action_closeDetailDialog();
          }}
        />
      );
    }

    return (
      <Dialog
        autoScrollBodyContent={true}
        title={
          <Translate value={'productions.keying_invoice.' + type_detail} />
        }
        actions={actions}
        modal={type_detail === KEY_SELF_COMMENT_DIALOG}
        open={is_open}
        onRequestClose={() => action_closeDetailDialog()}
      >
        <Divider />
        {type_detail === KEY_COMMENT_DIALOG && this.getMessageContent(comment)}
        {type_detail === KEY_SELF_COMMENT_DIALOG ? (
          <TextField
            autoFocus={true}
            floatingLabelText="Comment"
            errorText={error ? <Translate value={error} /> : ''}
            fullWidth={true}
            multiLine={true}
            rows={2}
            rowsMax={4}
            onChange={e => this.changeSelfComment(e.target.value)}
            value={self_comment}
          />
        ) : null}
      </Dialog>
    );
  }
}

export default WarningListComponent;
