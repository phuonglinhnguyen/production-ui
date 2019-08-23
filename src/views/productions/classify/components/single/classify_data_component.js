import React from "react";

import ClassifyDataLayout from "./classify_data_layout_component";
import ClassifyDataAction from "../../../common/button_actions";

import _ from "lodash";

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
      params.projectId,
      params.docId,
      taskDefKey,
      taskId,
      next_task,
      history
    );
  }

  render() {
    const {
      primary1Color,
      layout_definitions,
      is_empty_task,
      next_task,
      is_saving,
      selected_layout_definition,

      action_setTextSearch,
      action_updateNextTask,
      action_filterLayoutDefinitions,
      action_selectLayoutDefinition
    } = this.props;

    return (
      <div style={styles.main}>
        <ClassifyDataAction
          is_disabled={is_empty_task}
          is_saving={is_saving}
          next={next_task}
          updateNextTask={action_updateNextTask}
          saveTask={this.saveTask.bind(this)}
        />

        <ClassifyDataLayout
          primary1Color={primary1Color}
          is_fetching_layout_definitions={layout_definitions.is_fetching}
          layout_definitions={layout_definitions.datas}
          text_search={layout_definitions.text_search}
          selected_layout_definition={selected_layout_definition}
          action_filterLayoutDefinitions={action_filterLayoutDefinitions}
          action_setTextSearch={action_setTextSearch}
          action_selectLayoutDefinition={action_selectLayoutDefinition}
        />
      </div>
    );
  }
}

export default ClassifyData;
