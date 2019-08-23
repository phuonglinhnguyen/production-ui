import React from "react";

import OMRImageCanvasComponent from "./omr_image_canvas_component";
import OMRImageEmpty from "./omr_image_empty_component";

const styles = {
  main: {
    flex: "0 0 70%",
    position: "relative"
  }
};

class OMRImageComponent extends React.Component {

  componentWillMount() {
    this.getTask(true);
  }

  getTask(first_load) {
    const {
      verifying,
      projectId,
      layout_name,
      section_name,
      task_def_key: last_param
    } = this.props.params;
    const { username, history } = this.props;
    const [task_def_key, task_id] = last_param.split("/");
    if (first_load && !task_id) {
      return;
    }
    let first_url ;
    if (!verifying) {
      first_url = "omr"
    } else {
      first_url = "verifying/omr"
    } 
    this.props.actions.getTask({
      first_url,
      project_id:projectId,
      layout_name,
      section_name,
      task_def_key,
      task_id,
      username,
      history
    });
  }

  render() {
    const { omr, actions } = this.props;
    return (
      <div style={styles.main}>
        <OMRImageCanvasComponent
          data_task={omr.data_task}
          action_selectRectangle={actions.selectRectangle}
        />
        
        <OMRImageEmpty
          is_empty_task={omr.is_empty_task}
          is_fetching_task_omr={omr.is_fetching_task_omr}
          action_getTask={this.getTask.bind(this)}
          action_selectRectangle={actions.selectRectangle}
        />
      </div>
    );
  }
}

export default OMRImageComponent;
