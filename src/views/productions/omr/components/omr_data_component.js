import React from "react";

import Snackbar from "material-ui/Snackbar";

import OMRDataAction from "../../common/button_actions";
import OMRDataTable from "./omr_data_table_component";
import OMRDataVerifyTable from "./omr_data_verify_table_component";

import _ from "lodash";
import { Translate } from "react-redux-i18n";

const styles = {
  main: {
    flex: "1",
    padding: "4px 4px 4px 6px"
  }
};

class OMRData extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  componentWillUnmount() {
    this.props.action_resetStateTask();
  }

  saveTaskWithReason(reason) {
  }

  saveTask() {
    const {
      username,
      history,
      params,
      next_task,
      action_saveTask
    } = this.props;
    const { projectId, layout_name, section_name, verifying } = params;

    const [task_def_key, task_id] = params.task_def_key.split("/");

    let first_url;
    if (!verifying) {
      first_url = "omr";
    } else {
      first_url = "verifying/omr";
    }

    action_saveTask(
      username,
      first_url,
      projectId,
      layout_name,
      section_name,
      task_def_key,
      task_id,
      next_task,
      history
    );
  }

  render() {
    const {
      next_task,
      is_saving,
      is_empty_task,
      show_error,
      status_text,
      primary1Color,
      accent1Color,

      section,

      action_updateNextTask
    } = this.props;

    let body_table;
    if (!is_empty_task) {
      if (this.props.params.verifying) {
        body_table = (
          <OMRDataVerifyTable
            primary1Color={primary1Color}
            accent1Color={accent1Color}
            section={section}
          />
        );
      } else {
        body_table = (
          <OMRDataTable accent1Color={accent1Color} section={section} />
        );
      }
    }

    return (
      <div style={styles.main}>
        <OMRDataAction
          is_disabled={is_empty_task}
          is_saving={is_saving}
          next={next_task}
          saveTask={this.saveTask.bind(this)}
          updateNextTask={action_updateNextTask}
        />
        {body_table}
        <Snackbar
          open={show_error}
          message={<Translate value={status_text} />}
        />
      </div>
    );
  }
}

export default OMRData;
