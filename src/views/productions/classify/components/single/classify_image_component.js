import React from "react";

import Snackbar from "material-ui/Snackbar";

import ClassifyImageCanvas from "./classify_image_canvas_component";
import ClassifyImageEmpty from "./classify_image_empty_component";

import _ from "lodash";

import { Translate } from "react-redux-i18n";

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

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  getTask(first_load) {
    const { projectId, taskKeyDef: last_param } = this.props.match.params;
    const { username, history } = this.props;

    const [task_def_key, task_id] = last_param.split("/");
    if (first_load && !task_id) {
      return;
    }

    this.props.action_getTask(
      projectId,
      task_def_key,
      task_id,
      username,
      history
    );
  }

  render() {
    const {
      is_fetching_task_classify,
      is_empty_task,
      url_image,
      show_error,
      status_text,

      action_closeSnackBar
    } = this.props;

    return (
      <div ref="main_div" style={styles.main}>
        <ClassifyImageCanvas
          is_empty_task={is_empty_task}
          url_image={url_image}
        />
        <ClassifyImageEmpty
          is_empty_task={is_empty_task}
          is_fetching_task_classify={is_fetching_task_classify}
          getTask={this.getTask.bind(this)}
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

export default ClassifyImage;
