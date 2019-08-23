import React from "react";

import Snackbar from "material-ui/Snackbar";

// import ClassifyDataLayout from "../../components/single/classify_data_layout_component";
import ClassifyDataAction from "../../../common/button_actions";
import ClassifyDataTableComponent from "./classify_data_table_component";

import _ from "lodash";
import { Translate } from "react-redux-i18n";

const styles = {
  main: {
    flex: "1",
    padding: "4px 4px 4px 6px"
  }
};

class ClassifyData extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    this.props.action_resetStateTaskClassify();
    this.props.action_resetStateLayoutDefinitions();
  }

  saveTask() {
    const {
      username,
      history,
      params,
      next_task,

      action_saveTask
    } = this.props;

    const [taskDefKey, taskId] = params.taskKeyDef.split("/");

    action_saveTask(
      username,
      params.docSize,
      params.projectId,
      taskDefKey,
      taskId,
      next_task,
      history
    );
  }

  render() {
    const {
      accent1Color,
      primary1Color,
      // layout_definitions,
      is_empty_task,
      next_task,
      is_saving,
      show_error,
      status_text,
      selected_index_document,
      // layout,
      data_tasks,

      // action_setTextSearch,
      // action_filterLayoutDefinitions,
      // action_selectLayoutDefinition,
      action_changeApproved,
      action_changeAllApproved,
      action_closeSnackBar,
      action_updateNextTask,
      // action_saveTask,
      action_showDocSelected
    } = this.props;
    return (
      <div style={styles.main} className="cool_scroll">
        <ClassifyDataAction
          is_disabled={is_empty_task}
          is_saving={is_saving}
          next={next_task}
          updateNextTask={action_updateNextTask}
          saveTask={this.saveTask.bind(this)}
        />
        {/* {selected_index_document > -1 && (
          <ClassifyDataLayout
            primary1Color={primary1Color}
            is_fetching_layout_definitions={layout_definitions.is_fetching}
            layout_definitions={layout_definitions.datas}
            text_search={layout_definitions.text_search}
            selected_layout_definition={layout}
            action_filterLayoutDefinitions={action_filterLayoutDefinitions}
            action_setTextSearch={action_setTextSearch}
            action_saveTask={action_saveTask}
            action_selectLayoutDefinition={action_selectLayoutDefinition}
          />
        )} */}
        <ClassifyDataTableComponent
          primary1Color={primary1Color}
          accent1Color={accent1Color}
          data_tasks={data_tasks}
          selected_index_document={selected_index_document}
          action_showDocSelected={action_showDocSelected}
          action_changeApproved={action_changeApproved}
          action_changeAllApproved={action_changeAllApproved}
        />
        <Snackbar
          open={show_error}
          message={<Translate value={status_text} />}
          onRequestClose={action_closeSnackBar}
        />
      </div>
    );
  }
}

export default ClassifyData;
