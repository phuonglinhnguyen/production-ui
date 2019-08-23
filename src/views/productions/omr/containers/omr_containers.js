import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  resetStateTask,
  updateNextTask,
  closeSnackBar,
  getTask,
  saveTask,
  selectRectangle,
  getDataDefinitions
} from "../actions/omr_action";
import LoadingComponent from "../../../../components/Loading/Loading";
import OMRImageComponent from "../components/omr_image_component";
import OMRDataComponent from "../components/omr_data_component";

import muiThemeable from "material-ui/styles/muiThemeable";

const OMRContainer = props => {
  const style_main = {
    height: "calc(100vh - 64px)",
    width:'100%',
    display: "flex",
    flexWrap: "Wrap",
    backgroundColor: props.muiTheme.palette.background1Color
  };

  const { omr } = props;
  if (omr.is_fetching_data_definitions) {
    const { projectId, layout_name, section_name } = props.match.params;
    return (
      <LoadingComponent
        style={style_main}
        beforeMount={() =>
          props.actions.getDataDefinitions(
            projectId,
            layout_name,
            section_name
          )}
      />
    );
  }
  return (
    <div style={style_main}>
      <OMRImageComponent
        history={props.history}
        params={props.match.params}
        omr={omr}
        actions={props.actions}
      />
      <OMRDataComponent
        action_closeSnackBar={props.actions.closeSnackBar}
        action_resetStateTask={props.actions.resetStateTask}
        action_updateNextTask={props.actions.updateNextTask}
        action_saveTask={props.actions.saveTask}
        primary1Color={props.muiTheme.palette.primary1Color}
        accent1Color={props.muiTheme.palette.accent1FadeColor}
        params={props.match.params}
        history={props.history}
        username={props.username}
        next_task={omr.next_task}
        is_saving={omr.is_saving}
        is_empty_task={omr.is_empty_task}
        show_error={omr.show_error}
        status_text={omr.status_text}
        section={!omr.is_empty_task ? omr.data_task.section : null}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const { omr } = state.production;
  const { user } = state;

  return {
    omr,
    username: user.user.username
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      resetStateTask,
      updateNextTask,
      closeSnackBar,
      saveTask,
      getTask,
      selectRectangle,
      getDataDefinitions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(OMRContainer)
);
