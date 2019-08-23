import React from "react";

import ClassifyImageList from "./classify_image_list_component";
import ClassifyImageEmpty from "../single/classify_image_empty_component";

const styles = {
  main: {
    flex: "0 0 70%",
    position: "relative"
  }
};

class ClassifyImage extends React.Component {
  componentWillMount() {
    this.getTask(true);
  }

  getTask(first_load) {
    const {
      projectId,
      taskKeyDef: last_param,
      docSize
    } = this.props.match.params;
    const { username, history } = this.props;

    const [task_def_key, task_id] = last_param.split("/");
    if (first_load && !task_id) {
      return;
    }

    this.props.action_getTask(
      projectId,
      docSize,
      task_def_key,
      task_id,
      username,
      history
    );
  }

  render() {
    const {
      textColor,
      accent1Color,
      primary1Color,
      background4Color,
      is_empty_task,
      is_fetching_task_classify,
      show_canvas,
      selected_document,
      selected_index_document,
      is_display_list,
      data_tasks,
      data_tasks_length,

      action_showDocSelected,
      action_hideDocSelected,
      action_selectIndexDocument,
      action_changeDisplayType
    } = this.props;

    return (
      <div style={styles.main} ref="div_image">
        {!is_empty_task && (
          <ClassifyImageList
            ref="div_list"
            show_canvas={show_canvas}
            textColor={textColor}
            accent1Color={accent1Color}
            primary1Color={primary1Color}
            background4Color={background4Color}
            is_display_list={is_display_list}
            height_item={is_display_list ? 55 : 300}
            cols={is_display_list ? 2 : 4}
            selected_document={selected_document}
            selected_index_document={selected_index_document}
            data_tasks={data_tasks}
            data_tasks_length={data_tasks_length}
            action_showDocSelected={action_showDocSelected}
            action_hideDocSelected={action_hideDocSelected}
            action_selectIndexDocument={action_selectIndexDocument}
            action_changeDisplayType={action_changeDisplayType}
          />
        )}
        <ClassifyImageEmpty
          is_multiple={true}
          is_empty_task={is_empty_task}
          is_fetching_task_classify={is_fetching_task_classify}
          getTask={this.getTask.bind(this)}
        />
      </div>
    );
  }
}
export default ClassifyImage;
