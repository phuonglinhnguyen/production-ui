import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const DialogComponent = ({ dialog, actions, Translate }) => {
  let {
    open_dialog,
    title_dialog,
    handleClickSubmit,
    label_button_dialog,
    body_dialog
  } = dialog;

  const action_button = [
    <FlatButton
      label={<Translate value={'commons.actions.cancel'} />}
      primary={true}
      onClick={() => actions.resetDialog()}
    />,
    <FlatButton
      label={
        label_button_dialog ? (
          <Translate value={label_button_dialog} />
        ) : (
          'Submit'
        )
      }
      primary={true}
      keyboardFocused={true}
      onClick={handleClickSubmit}
    />
  ];

  if (!open_dialog) {
    return null;
  }
  return (
    <Dialog
      title={title_dialog}
      actions={action_button}
      modal={false}
      open={open_dialog}
      onRequestClose={() => actions.resetDialog()}
    >
      {body_dialog}
    </Dialog>
  );
};

DialogComponent.propTypes = {
  open_dialog: PropTypes.bool,

  title_dialog: PropTypes.string,
  label_button_dialog: PropTypes.string,

  handleClickSubmit: PropTypes.func,
  Translate: PropTypes.func.isRequired
};

export default DialogComponent;
