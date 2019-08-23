import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ClassifyLoadingComponent from "../../components/single/classify_loading_component";
import ClassifyImage from "../../components/verify/classify_image_component";
import ClassifyData from "../../components/verify/classify_data_component";

import {
  changeDisplayType,
  showDocSelected,
  hideDocSelected,
  selectIndexDocument,
  selectLayoutDefinition,
  getDataDefinitionsForClassify,
  resetStateTaskClassify,
  closeSnackBar,
  updateNextTask,
  changeApproved,
  changeAllApproved,
  saveTask,
  getTask
} from "../../actions/classify_verify_action";
import {
  setTextSearch,
  filterLayoutDefinitions,
  getLayoutDefinitions,
  resetStateLayoutDefinitions
} from "../../actions/layout_definition_action";

import muiThemeable from "material-ui/styles/muiThemeable";

const ClassifyContainer = props => {
  const { data_classify } = props;

  const style_main = {
    height: "calc(100vh - 64px)",
    width:'100%',
    display: "flex",
    flexWrap: "Wrap",
    backgroundColor: props.muiTheme.palette.background1Color
  };
  
  if (data_classify.is_fetching_data_definitions) {
    return (
      <ClassifyLoadingComponent
        style={style_main}
        match={props.match}
        action_getDataDefinitionsForClassify={
          props.actions.getDataDefinitionsForClassify
        }
      />
    );
  }

  const layout =
    data_classify.selected_index_document > -1
      ? data_classify.selected_document.layout
      : null;

  return (
    <div style={style_main}>
      <ClassifyImage
        is_empty_task={data_classify.data_tasks_length === 0}
        is_fetching_task_classify={data_classify.is_fetching_task_classify}
        match={props.match}
        history={props.history}
        username={props.username}
        textColor={props.muiTheme.palette.textColor}
        primary1Color={props.muiTheme.palette.primary1Color}
        background4Color={props.muiTheme.palette.background3Color}        
        show_canvas={data_classify.show_canvas}
        selected_document={data_classify.selected_document}
        selected_index_document={data_classify.selected_index_document}
        data_tasks={data_classify.data_tasks}
        data_tasks_length={data_classify.data_tasks_length}
        is_display_list={data_classify.is_display_list}
        action_getTask={props.actions.getTask}
        action_showDocSelected={props.actions.showDocSelected}
        action_hideDocSelected={props.actions.hideDocSelected}
        action_selectIndexDocument={props.actions.selectIndexDocument}
        action_changeDisplayType={props.actions.changeDisplayType}
        accent1Color={props.muiTheme.palette.accent1Color}
      />
      <ClassifyData
        accent1Color={props.muiTheme.palette.accent1Color}
        data_tasks={data_classify.data_tasks}
        next_task={data_classify.next_task}
        params={props.match.params}
        history={props.history}
        username={props.username}
        status_text={data_classify.status_text}
        show_error={data_classify.show_error}
        primary1Color={props.muiTheme.palette.primary1Color}
        is_empty_task={data_classify.data_tasks_length === 0}
        is_saving={data_classify.is_saving}
        layout={layout}
        action_showDocSelected={props.actions.showDocSelected}
        selected_index_document={data_classify.selected_index_document}
        layout_definitions={props.layout_definitions}
        action_updateNextTask={props.actions.updateNextTask}
        action_saveTask={props.actions.saveTask}
        action_resetStateTaskClassify={props.actions.resetStateTaskClassify}
        action_setTextSearch={props.actions.setTextSearch}
        action_filterLayoutDefinitions={props.actions.filterLayoutDefinitions}
        action_getLayoutDefinitions={props.actions.getLayoutDefinitions}
        action_changeApproved={props.actions.changeApproved}
        action_changeAllApproved={props.actions.changeAllApproved}
        action_selectLayoutDefinition={props.actions.selectLayoutDefinition}
        action_closeSnackBar={props.actions.closeSnackBar}
        action_resetStateLayoutDefinitions={
          props.actions.resetStateLayoutDefinitions
        }
      />
    </div>
  );
};

const mapStateToProps = state => {
  const { layout_definitions, classify_verify } = state.production.classify;
  const { user } = state;

  return {
    data_classify: classify_verify,
    layout_definitions,
    username: user.user.username
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      changeDisplayType,
      getTask,
      saveTask,
      selectIndexDocument,
      showDocSelected,
      hideDocSelected,
      selectLayoutDefinition,
      getDataDefinitionsForClassify,
      closeSnackBar,
      updateNextTask,
      resetStateTaskClassify,
      changeApproved,
      changeAllApproved,

      setTextSearch,
      filterLayoutDefinitions,
      getLayoutDefinitions,
      resetStateLayoutDefinitions
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(ClassifyContainer)
);
