import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import NotificationBarComponentComponent from "./component";
import * as actions from "./action";

const mapStateToProps = state => ({
  notification_bar: state.common.notification_bar
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationBarComponentComponent);
