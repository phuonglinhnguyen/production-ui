import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ClassifyLoadingData from "../../components/single/classify_loading_component";
import ClassifyDataComponent from "../../components/single/classify_data_component";
import ClassifyImageComponent from "../../components/single/classify_image_component";

import {
  getDataDefinitionsForClassify,
  selectLayoutDefinition,
  closeSnackBar,
  getTask,
  saveTask,
  updateNextTask,
  resetStateTaskClassify
} from "../../actions/classify_single_action";
import {
  setTextSearch,
  filterLayoutDefinitions,
  getLayoutDefinitions,
  resetStateLayoutDefinitions
} from "../../actions/layout_definition_action";

import muiThemeable from "material-ui/styles/muiThemeable";

const ClassifyContainer = props => {
  const style_main = {
    height: "calc(100vh - 64px)",
    width:'100%',
    display: "flex",
    flexWrap: "Wrap",
    backgroundColor: props.muiTheme.palette.background1Color
  };

  const { data_classify } = props;
  if (data_classify.is_fetching_data_definitions) {
    return (
      <ClassifyLoadingData
        style={style_main}
        match={props.match}
        action_getDataDefinitionsForClassify={
          props.actions.getDataDefinitionsForClassify
        }
      />
    );
  }
  return (
    <div style={style_main}>
      <ClassifyImageComponent
        match={props.match}
        history={props.history}
        username={props.username}
        document={data_classify.document}
        status_text={data_classify.status_text}
        show_error={data_classify.show_error}
        url_image={
          data_classify.is_empty_task ? "" : data_classify.data_task.s2_url
        }
        is_empty_task={data_classify.is_empty_task}
        is_fetching_task_classify={data_classify.is_fetching_task_classify}
        action_getTask={props.actions.getTask}
        action_closeSnackBar={props.actions.closeSnackBar}
      />

      <ClassifyDataComponent
        params={props.match.params}
        history={props.history}
        username={props.username}
        primary1Color={props.muiTheme.palette.primary1Color}
        is_empty_task={data_classify.is_empty_task}
        is_saving={data_classify.is_saving}
        next_task={data_classify.next_task}
        selected_layout_definition={data_classify.selected_layout_definition}
        layout_definitions={props.layout_definitions}
        action_setTextSearch={props.actions.setTextSearch}
        action_filterLayoutDefinitions={props.actions.filterLayoutDefinitions}
        action_getLayoutDefinitions={props.actions.getLayoutDefinitions}
        action_resetStateLayoutDefinitions={
          props.actions.resetStateLayoutDefinitions
        }
        action_updateNextTask={props.actions.updateNextTask}
        action_selectLayoutDefinition={props.actions.selectLayoutDefinition}
        action_saveTask={props.actions.saveTask}
        action_resetStateTaskClassify={props.actions.resetStateTaskClassify}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const { classify_single, layout_definitions } = state.production.classify;
  const { user } = state;

  return {
    data_classify: classify_single,
    layout_definitions: layout_definitions,
    username: user.user.username
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      setTextSearch,
      filterLayoutDefinitions,
      getLayoutDefinitions,
      resetStateLayoutDefinitions,

      getDataDefinitionsForClassify,
      selectLayoutDefinition,
      closeSnackBar,
      getTask,
      saveTask,
      updateNextTask,
      resetStateTaskClassify
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(ClassifyContainer)
);
