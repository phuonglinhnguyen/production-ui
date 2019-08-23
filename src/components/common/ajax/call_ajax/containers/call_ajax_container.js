import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import SaveDataComponent from "../components/call_ajax_component";

import { closeSnackbar } from "../actions/call_ajax_action";

const mapStateToProps = state => {
  const { ajax_call_ajax } = state.common;

  return ajax_call_ajax;
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        closeSnackbar
      },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveDataComponent);
