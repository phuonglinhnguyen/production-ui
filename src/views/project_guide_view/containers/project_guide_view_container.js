import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Translate } from 'react-redux-i18n';
import { showNotification } from '@dgtx/coreui'
import * as actions from '../actions/project_guide_view_action';
import ProjectGuideViewComponent from '../components/project_guide_view_tabs_component';

const mapStateToProps = (state, props) => {
  return {
    project_guide_view: state.production.project_guide_view
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...actions
    },
    dispatch
  ),
  ...bindActionCreators({showNotification},dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectGuideViewComponent);
