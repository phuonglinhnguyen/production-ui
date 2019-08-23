import React from "react";

import Snackbar from "material-ui/Snackbar";

import { Translate } from "react-redux-i18n";

class SaveData extends React.PureComponent {
  render() {
    const { name, reason } = this.props;
    const { status_text, show_snack_bar } = this.props;

    if (!show_snack_bar || !status_text) {
      return null;
    }

    return (
      <Snackbar
        open={show_snack_bar}
        message={<Translate name={name} reason={reason} value={status_text} />}
        autoHideDuration={4000}
        onRequestClose={this.props.actions.closeSnackbar}
      />
    );
  }
}
export default SaveData;
