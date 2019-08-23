import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { isEqual } from 'lodash';

class ApproveDialogComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
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

  render() {
    const {
      Translate,
      action_closeDialog,
      action_saveRework,
      open_dialog
    } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        keyboardFocused={true}
        onClick={() => action_closeDialog()}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onClick={() => action_saveRework()}
      />
    ];

    return (
      <Dialog actions={actions} modal={false} open={open_dialog}>
        <Translate value="productions.rework_batch.close_task" />
      </Dialog>
    );
  }
}

export default ApproveDialogComponent;
